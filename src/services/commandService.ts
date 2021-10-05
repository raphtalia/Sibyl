import constants from "../constants";
import { Bot, Command, CommandArgument, CommandArgumentChoice } from "../types";

import { CommandInteraction, Message } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { SlashCommandBuilder } from "@discordjs/builders";
import { parse } from "discord-command-parser";
import Fuzzy from "fuzzy-matching";
import format from "string-format";

const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_API_KEY);

function buildOption(argumentBuilder, argument: CommandArgument) {
  argumentBuilder.setName(argument.name);
  argumentBuilder.setDescription(argument.description || " ");
  argumentBuilder.setRequired(argument.required == true);

  const choices = argument.choices;
  if (choices) {
    choices.forEach((choice: CommandArgumentChoice) => {
      argumentBuilder.addChoice(choice.label, choice.value);
    });
  }

  return argumentBuilder;
}

function buildOptions(commandBuilder, command: Command) {
  Object.values(command.arguments).forEach((argument) => {
    if (argument.multiple) {
      // Argument takes multiple values, simply add a String option
      commandBuilder.addStringOption((option) => buildOption(option, argument));
    } else {
      switch (argument.type) {
        case "BOOLEAN": {
          commandBuilder.addBooleanOption((option) =>
            buildOption(option, argument)
          );
          break;
        }
        case "CHANNEL": {
          commandBuilder.addChannelOption((option) =>
            buildOption(option, argument)
          );
          break;
        }
        case "INTEGER": {
          commandBuilder.addIntegerOption((option) =>
            buildOption(option, argument)
          );
          break;
        }
        case "MENTIONABLE": {
          commandBuilder.addMentionableOption((option) =>
            buildOption(option, argument)
          );
          break;
        }
        case "ROLE": {
          commandBuilder.addRoleOption((option) =>
            buildOption(option, argument)
          );
          break;
        }
        case "STRING": {
          commandBuilder.addStringOption((option) =>
            buildOption(option, argument)
          );
          break;
        }
        case "USER": {
          commandBuilder.addUserOption((option) =>
            buildOption(option, argument)
          );
          break;
        }
      }
    }
  });
}

function buildSubcommands(commandBuilder, command: Command) {
  command.subcommands.forEach((subcommand) => {
    commandBuilder.addSubcommand((subcommandBuilder) => {
      subcommandBuilder.setName(subcommand.name);
      subcommandBuilder.setDescription(subcommand.description || " ");

      const args = subcommand.arguments;
      if (args) {
        buildOptions(subcommandBuilder, subcommand);
      }
      return subcommandBuilder;
    });
  });
}

async function getArguments(
  command: Command,
  message: Message | CommandInteraction
) {
  const args = {};

  if ("options" in message) {
    // message is a CommandInteraction
    let options = message.options;
    Object.values(command.arguments).forEach((argument) => {
      if (argument.multiple) {
        args[argument.name] = options.getString(argument.name);
      } else {
        switch (argument.type) {
          case "BOOLEAN": {
            args[argument.name] = options.getBoolean(argument.name);
            break;
          }
          case "CHANNEL": {
            args[argument.name] = options.getChannel(argument.name);
            break;
          }
          case "INTEGER": {
            args[argument.name] = options.getInteger(argument.name);
            break;
          }
          case "MENTIONABLE": {
            args[argument.name] = options.getMentionable(argument.name);
            break;
          }
          case "ROLE": {
            args[argument.name] = options.getRole(argument.name);
            break;
          }
          case "STRING": {
            args[argument.name] = options.getString(argument.name);
            break;
          }
          case "USER": {
            args[argument.name] = options.getUser(argument.name);
            break;
          }
        }
      }
    });
  } else {
    // message is a Message
    const parsedCommand = parse(message, constants.COMMAND_PREFIX, {
      allowSpaceBeforeCommand: true,
    });

    if (!parsedCommand.success) return;

    let reader = parsedCommand.reader;
    let client = message.client;
    for (const argument of command.arguments) {
      if (argument.multiple) {
        args[argument.name] = reader.getRemaining();
        break;
      } else {
        switch (argument.type) {
          case "BOOLEAN": {
            args[argument.name] = reader.getString().toLowerCase() === "true";
            break;
          }
          case "CHANNEL": {
            args[argument.name] = await client.channels.fetch(
              reader.getChannelID()
            );
            break;
          }
          case "INTEGER": {
            args[argument.name] = reader.getInt();
            break;
          }
          case "MENTIONABLE": {
            args[argument.name] = await client.users.fetch(reader.getUserID());
            break;
          }
          case "ROLE": {
            const guild = message.guild;

            if (!guild) {
              throw "Cannot get role from a DM";
            }

            args[argument.name] = await guild.roles.fetch(reader.getRoleID());
            break;
          }
          case "STRING": {
            args[argument.name] = reader.getString();
            break;
          }
          case "USER": {
            args[argument.name] = await client.users.fetch(reader.getUserID());
            break;
          }
        }
      }
    }
  }

  return args;
}

export = class commandService {
  _bot: Bot;
  _fuzzyCommandSearcher;
  commands = {};

  constructor(bot: Bot) {
    this._bot = bot;
    this._fuzzyCommandSearcher = new Fuzzy();

    console.log("[CommandService] Initializing");
    bot.client.on("messageCreate", async (msg) => {
      const parsedCommand = parse(msg, constants.COMMAND_PREFIX, {
        allowSpaceBeforeCommand: true,
      });

      if (!parsedCommand.success) return;

      const parsedCommandName = parsedCommand.command
      const command: Command = this.commands[parsedCommandName];
      if (command) {
        if (!command.slashOnly) {
          if (msg.guild) {
            console.log(
              `[CommandService] Command: ${parsedCommandName} from ${msg.author.tag} in ${msg.guild.name}`
            );
          } else {
            console.log(
              `[CommandService] Command: ${parsedCommandName} from ${msg.author.tag} in DM`
            );
          }

          if (command) {
            this.commands[parsedCommandName].execute({
              bot: this._bot,
              message: msg,
              arguments: await getArguments(command, msg),
            });
          }
        } else {
          console.warn(
            `[CommandService] User ${msg.author.tag} attempted to run slash-only command ${parsedCommandName}`
          );

          msg.reply(constants.ERRORS.SLASH_ONLY_COMMAND);
        }
      } else {
        if (msg.guild) {
          console.warn(
            `[CommandService] Command not found: ${parsedCommandName} from ${msg.author.tag} in ${msg.guild.name}`
          );
        } else {
          console.warn(
            `[CommandService] Command not found: ${parsedCommandName} from ${msg.author.tag} in DM`
          );
        }

        const similarCommand = this.getCommandFuzzy(parsedCommandName);
        if (similarCommand) {
          msg.reply(format(constants.ERRORS.TYPO_COMMAND, parsedCommandName, similarCommand.name));
        } else {
          msg.reply(constants.ERRORS.UNKNOWN_COMMAND);
        }
      }
    });

    bot.client.on("interactionCreate", async (interaction) => {
      if (!interaction.isCommand()) return;

      const command: Command = this.commands[interaction.commandName];
      if (command) {
        if (!command.subcommands) {
          if (interaction.guild) {
            console.log(
              `[CommandService] Slash command: ${interaction.commandName} from ${interaction.user.tag} in ${interaction.guild.name}`
            );
          } else {
            console.log(
              `[CommandService] Slash command: ${interaction.commandName} from ${interaction.user.tag} in DM`
            );
          }

          command.execute({
            bot: this._bot,
            message: interaction,
            arguments: await getArguments(command, interaction),
          });
        } else {
          const subcommand: Command = command.subcommands.find(
            (subcommand) =>
              subcommand.name == interaction.options.getSubcommand()
          );

          if (interaction.guild) {
            console.log(
              `[CommandService] Slash command: ${interaction.commandName}/${subcommand.name} from ${interaction.user.tag} in ${interaction.guild.name}`
            );
          } else {
            console.log(
              `[CommandService] Slash command: ${interaction.commandName}/${subcommand.name} from ${interaction.user.tag} in DM`
            );
          }

          subcommand.execute({
            bot: this._bot,
            message: interaction,
            arguments: await getArguments(subcommand, interaction),
          });
        }
      } else {
        console.log(
          `[CommandService] Slash command not found: ${interaction.commandName} from ${interaction.user.tag} in ${interaction.guild.name}`
        );
      }
    });
  }

  getCommandFuzzy(commandName: string) {
    commandName = commandName.toLowerCase();

    let match = this._fuzzyCommandSearcher.get(commandName);
    if (match.distance > constants.COMMAND_FUZZY_CONFIDENCE) {
      return this.commands[match.value];
    }

    return null;
  }

  registerCommand(command: Command) {
    // Check if command is valid
    if (!command.name) {
      throw "Command name is required";
    }
    let commandName = command.name.toLowerCase()
    if (!command.execute) {
      throw `Execute method is required for command ${commandName}`;
    }

    const args = command.arguments;
    if (args) {
      let nonRequire = false;
      for (const [i, argument] of args.entries()) {
        if (!argument.name) {
          throw `Command ${commandName} argument #${i} name is required`;
        }
        if (!argument.type) {
          throw `Command ${commandName} argument ${argument.name} type is required`;
        }
        if (argument.required) {
          if (nonRequire) {
            throw `Command ${commandName} argument ${argument.name} must be placed before non-required arguments`;
          }
        } else {
          nonRequire = true;
        }
        if (argument.multiple && i != args.length - 1) {
          throw `Command ${commandName} argument ${argument.name} must be placed at the end for multiple values`;
        }
      }
    }

    this.commands[commandName] = command;
    this._fuzzyCommandSearcher.add(commandName);
    console.log(`[CommandService] Registered command: ${commandName}`);
  }

  reloadSlashCommands() {
    const commands = [];

    Object.values(this.commands).forEach((command: Command) => {
      let commandBuilder = new SlashCommandBuilder()
        .setName(command.name)
        .setDescription(command.description || "");

      const args = command.arguments;
      if (args) {
        buildOptions(commandBuilder, command);
      }

      const subcommands = command.subcommands;
      if (subcommands) {
        buildSubcommands(commandBuilder, command);
      }

      commands.push(commandBuilder);
    });

    (async () => {
      console.log("[CommandService] Reloading slash commands.");

      try {
        let clientId = this._bot.client.user.id;
        const promises = [];
        this._bot.client.guilds.cache.map((guild) => {
          console.log(
            `[CommandService] Reloading slash commands for ${guild.name}`
          );

          promises.push(
            rest
              .put(Routes.applicationGuildCommands(clientId, guild.id), {
                body: commands,
              })
              .catch((e) => {
                console.error(
                  `[CommandService] Error reloading slash commands for ${guild.name}\n${e}`
                );
              })
          );
        });

        await Promise.all(promises);

        console.log("[CommandService] Reloading global slash commands");
        await rest
          .put(Routes.applicationCommands(clientId), {
            body: commands,
          })
          .catch((e) => {
            console.error(
              `[CommandService] Error reloading global slash commands\n${e}`
            );
          });

        console.log("[CommandService] Finished reloaded slash commands.");
      } catch (e) {
        console.error(`[CommandService] Error reloading slash commands\n${e}`);
      }
    })();
  }
};
