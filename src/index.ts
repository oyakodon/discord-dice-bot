import { InteractionResponseType, InteractionType, verifyKey } from 'discord-interactions';
import { DICE_COMMAND } from './commands.json';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		if (request.method === 'GET') {
			return new Response(env.DISCORD_APPLICATION_ID);
		}

		const { isValid, interaction } = await await verifyDiscordRequest(request, env);
		if (!isValid || !interaction) {
			return new Response('Bad request signature.', { status: 401 });
		}

		if (interaction.type === InteractionType.PING) {
			return Response.json({ type: InteractionResponseType.PONG });
		}

		if (interaction.type === InteractionType.APPLICATION_COMMAND) {
			switch (interaction.data.name.toLowerCase()) {
				case DICE_COMMAND.name.toLowerCase(): {
					return Response.json({
						type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
						data: {
							content: 'success',
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

async function verifyDiscordRequest(request: Request, env: Env) {
	const signature = request.headers.get('x-signature-ed25519');
	const timestamp = request.headers.get('x-signature-timestamp');
	const body = await request.text();
	const isValidRequest = signature && timestamp && (await verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY));
	if (!isValidRequest) {
		return { isValid: false };
	}

	return { interaction: JSON.parse(body), isValid: true };
}
