// import { SlashCommandBuilder } from '@discordjs/builders';
import { parse } from 'discord-command-parser';

import { COMMAND_PREFIX, ERROR_MESSAGES } from '../constants';

import Service from '../classes/Service';
import commands from '../commands';

import type Command from '../classes/Command';
// import type { CommandInteraction, Message } from 'discord.js';

const commandService = new Service({
	name: 'CommandService'
});

commandService.register('start', async (service) => {
	service.sibyl.client.on('messageCreate', async (msg) => {
		const parsedCommand = parse(msg, COMMAND_PREFIX, {
			allowSpaceBeforeCommand: true
		});

		if (!parsedCommand.success) return;

		const parsedCommandName = parsedCommand.command;
		const command: Command = commands[parsedCommandName];
		if (command) {
			command.execute(msg.author, msg, parsedCommand.arguments);
		} else {
			if (msg.guild) {
				console.warn(
					`Command not found: ${parsedCommandName} from ${msg.author.tag} in ${msg.guild.name}`
				);
			} else {
				console.warn(`Command not found: ${parsedCommandName} from ${msg.author.tag} in DM`);
			}

			/*
			const similarCommand = this.getCommandFuzzy(parsedCommandName);
			if (similarCommand) {
				msg.reply(format(ERROR_MESSAGES.TYPO_COMMAND, parsedCommandName, similarCommand.name));
			} else {
				msg.reply(ERROR_MESSAGES.UNKNOWN_COMMAND);
			}
			*/

			msg.reply(ERROR_MESSAGES.UNKNOWN_COMMAND);
		}
	});
});

export default commandService;
