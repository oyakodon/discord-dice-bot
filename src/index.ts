import { InteractionResponseType, verifyKey } from 'discord-interactions';
import { APIApplicationCommandInteraction, APIInteraction, InteractionType } from 'discord-api-types/v10';
import { DICE_COMMAND, FORTUNE_COMMAND } from './commands.json';
import dice from './dice';
import fortune from './fortune';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		if (request.method === 'GET') {
			return new Response(env.DISCORD_APPLICATION_ID);
		}

		const { isValid, interaction } = await await verifyDiscordRequest(request, env);
		if (!isValid || !interaction) {
			return new Response('Bad request signature.', { status: 401 });
		}

		if (interaction.type === InteractionType.Ping) {
			return Response.json({ type: InteractionResponseType.PONG });
		}

		if (interaction.type === InteractionType.ApplicationCommand) {
			const command = interaction as APIApplicationCommandInteraction;

			switch (command.data.name.toLowerCase()) {
				case DICE_COMMAND.name.toLowerCase(): {
					const options = (command.data as any).options as {
						name: string;
						type: number;
						value?: string | number | boolean;
					}[];

					let content = '';
					if (options && options.length > 0) {
						const option = options[0];
						switch (option.name.toLowerCase()) {
							case 'input':
								const input = option.value as string;
								content = dice.replaceDice(input);
								break;
							case 'amount':
								const amount = option.value as string;
								content = dice.rollDice(amount);
								break;
							default:
								console.log('Unknown option:', option.name);
								return Response.json({ error: 'Unknown option' }, { status: 400 });
						}
					} else {
						content = dice.rollDice();
					}

					return Response.json({
						type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
						data: {
							content,
						},
					});
				}

				case FORTUNE_COMMAND.name.toLowerCase(): {
					return Response.json({
						type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
						data: {
							content: fortune.pick(),
						},
					});
				}

				default:
					return Response.json({ error: 'Unknown Type' }, { status: 400 });
			}
		}

		console.error('Unknown Type');
		return Response.json({ error: 'Unknown Type' }, { status: 400 });
	},
} satisfies ExportedHandler<Env>;

async function verifyDiscordRequest(request: Request, env: Env): Promise<{ interaction?: APIInteraction; isValid: boolean }> {
	const signature = request.headers.get('x-signature-ed25519');
	const timestamp = request.headers.get('x-signature-timestamp');
	const body = await request.text();
	const isValidRequest = signature && timestamp && (await verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY));
	if (!isValidRequest) {
		return { isValid: false };
	}

	return { interaction: JSON.parse(body) satisfies APIInteraction, isValid: true };
}
