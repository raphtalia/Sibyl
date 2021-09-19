import { CommandContext } from "../../types";

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
    commandContext.message.reply(commandContext.arguments.tags.toString());
  },
};
