import { SlashCommandBuilder } from 'discord.js';
import { join, dirname } from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const DICE_COMMAND = new SlashCommandBuilder()
	.setName('dice')
	.setDescription('Roll a dice')
	.addStringOption((option) => option.setName('input').setDescription('input'))
	.addStringOption((option) => option.setName('amount').setDescription('amount'))
	.addBooleanOption((option) => option.setName('おみくじ').setDescription('おみくじ'))
	.toJSON();

const outputPath = join(__dirname, '../src', 'commands.json');
await fs.writeFile(outputPath, JSON.stringify({ DICE_COMMAND }, null, 2));
