import { Intents } from 'discord.js';

export const COMMAND_PREFIX = '!';

export const INTENTS = [
	Intents.FLAGS.DIRECT_MESSAGES,
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MESSAGES
];

// TODO: Improve error message handling
export const ERROR_MESSAGES = {
	TYPO_COMMAND:
		'**{}** is not a command, the most similar command is **{}**, or run **!help** for help.',
	UNKNOWN_COMMAND: 'Invalid command, run **!help** for help.',
	SLASH_ONLY_COMMAND: 'This command can only be used as a slash command.'
};
