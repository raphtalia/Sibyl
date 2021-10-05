import { Command, CommandContext } from "../types";

import { MessageEmbed, TextChannel } from "discord.js";

export = {
  name: "help",
  description: "Lists all available commands",
  arguments: [
    {
      name: "command",
      description: "Command to get more details on",
      type: "STRING",
    },
  ],

  async execute(commandContext: CommandContext) {
    const commands: Command[] = commandContext.bot.services.commandService.commands;

    const embed = new MessageEmbed()
      .setTitle("Sibyl - All")

    Object.values(commands).forEach((command) => {
        embed.addField(command.name, command.description);
    });

    commandContext.message.reply({ embeds: [embed] });
  },
};
