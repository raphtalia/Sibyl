import { CommandContext } from "../../types";

import { MessageEmbed, TextChannel } from "discord.js";

export = {
  name: "reddit",
  description: "Sends a reddit image",
  arguments: [
    {
      name: "subreddit",
      description: "subreddit to search",
      required: true,
      type: "STRING"
    },
  ],

  async execute(commandContext: CommandContext) {
    // const message = commandContext.message;
    // if (
    //   message.guild &&
    //   message.channel instanceof TextChannel &&
    //   !message.channel.nsfw
    // ) {
    //   message.reply("This command can only be used in NSFW channels or DMs.");
    //   return;
    // }

    // message.reply({ embeds: [embed] });
  },
};
