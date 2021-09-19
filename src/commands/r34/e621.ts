import { CommandContext } from "../../types";

import E621 from "e621";
import { MessageEmbed, TextChannel } from "discord.js";

const e621 = new E621();

export = {
  name: "e621",
  description: "Sends an E621 image",
  arguments: [
    {
      name: "tags",
      description: "Tags to search for",
      required: true,
      multiple: true,
    },
  ],

  async execute(commandContext: CommandContext) {
    const message = commandContext.message;
    if (
      message.guild &&
      message.channel instanceof TextChannel &&
      !message.channel.nsfw
    ) {
      message.reply("This command can only be used in NSFW channels or DMs.");
      return;
    }

    const tags: string[] = commandContext.arguments.tags
      .toString()
      .split(",")
      .slice(0, 39);
    const posts = await e621.getPosts(tags, 320);
    const post = posts[Math.floor(Math.random() * posts.length)];

    const embed = new MessageEmbed()
      .setTitle("E621")
      .setURL(`https://e621.net/posts/${post.id}`)
      .setAuthor(post.tags.artist.join(", "), null, `https://e621.net/posts?tags=${post.tags.artist.join("+")}`)
      .setImage(post.file.url)
      .setFooter(post.tags.general.join(", "));

    message.reply({ embeds: [embed] });
  },
};
