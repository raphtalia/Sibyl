import { CommandContext } from "../../types";

export = {
  name: "furaffinity",
  description: "Sends a furaffinity image",
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
