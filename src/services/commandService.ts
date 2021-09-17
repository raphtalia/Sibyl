import constants from "../constants";
import { Bot, Command, commandArgument } from "../types";

import { Message } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { SlashCommandBuilder } from "@discordjs/builders";
import { parse } from "discord-command-parser";

const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_API_KEY);

function buildOption(option, argument: commandArgument) {
  option.setName(argument.name);
  option.setDescription(argument.description || " ");
  option.setRequired(argument.required == true);
  return option;
}

export = class commandService {
  commands = {};
  bot: Bot;

  constructor(bot: Bot) {
    this.bot = bot;

    console.log("[CommandService] Initializing");
    bot.client.on("messageCreate", async (msg: Message) => {
      const parsed = parse(msg, constants.COMMAND_PREFIX, {
        allowSpaceBeforeCommand: true,
      });

      if (!parsed.success) return;

      const command = this.commands[parsed.command];
      if (command) {
        if (msg.guild) {
          console.log(
            `[CommandService] Command: ${parsed.command} from ${msg.author.tag} in ${msg.guild.name}`
          );
        } else {
          console.log(
            `[CommandService] Command: ${parsed.command} from ${msg.author.tag} in DM`
          );
        }

        if (command) {
          this.commands[parsed.command].execute({
            message: msg,
            parsed: parsed,
          });
        }
      } else {
        if (msg.guild) {
          console.log(
            `[CommandService] Command not found: ${parsed.command} from ${msg.author.tag} in ${msg.guild.name}`
          );
        } else {
          console.log(
            `[CommandService] Command not found: ${parsed.command} from ${msg.author.tag} in DM`
          );
        }

        msg.reply(constants.ERRORS.UNKNOWN_COMMAND);
      }
    });
  }

  registerCommand(command) {
    this.commands[command.name] = command;
    console.log(`[CommandService] Registered command: ${command.name}`);
  }

  reloadSlashCommands() {
    const commands = [];

    Object.values(this.commands).forEach((command: Command) => {
      let slashCommand = new SlashCommandBuilder()
        .setName(command.name)
        .setDescription(command.description);

      Object.values(command.arguments).forEach((argument) => {
        // TODO: Figure out how to clean statement up to reduce repetitive code
        switch (argument.type) {
          case "BOOLEAN": {
            slashCommand.addBooleanOption(option => buildOption(option, argument));
            break;
          }
          case "CHANNEL": {
            slashCommand.addChannelOption(option => buildOption(option, argument));
            break;
          }
          case "INTEGER": {
            slashCommand.addIntegerOption(option => buildOption(option, argument));
            break;
          }
          case "MENTIONABLE": {
            slashCommand.addMentionableOption(option => buildOption(option, argument));
            break;
          }
          case "ROLE": {
            slashCommand.addRoleOption(option => buildOption(option, argument));
            break;
          }
          case "STRING": {
            slashCommand.addStringOption(option => buildOption(option, argument));
            break;
          }
          case "USER": {
            slashCommand.addUserOption(option => buildOption(option, argument));
            break;
          }
        }
      });

      commands.push(slashCommand);
    });

    (async () => {
      try {
        console.log("[CommandService] Reloading slash commands.");

        const promises = [];
        this.bot.client.guilds.cache.map((guild) => {
          console.log(
            `[CommandService] Reloading slash commands for ${guild.name}`
          );

          promises.push(
            rest.put(
              Routes.applicationGuildCommands(
                this.bot.client.user.id,
                guild.id
              ),
              {
                body: commands,
              }
            )
          );
        });

        await Promise.all(promises).catch(console.error);

        // TODO: Fix this log message occurring even on errors
        console.log("[CommandService] Successfully reloaded slash commands.");
      } catch (error) {
        console.error(error);
      }
    })();
  }
};
