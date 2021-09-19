import { CommandContext } from "../types";
import Uwuifier from "uwuifier";

const uwuifier = new Uwuifier();

export = {
  name: "uwuify",
  description: "Uwuifies a message",
  arguments: [
    {
      name: "message",
      description: "Message to uwuify",
      type: "STRING",
      required: true,
      multiple: true,
    },
  ],

  async execute(commandContext: CommandContext) {
    commandContext.message.reply(
      uwuifier.uwuifySentence(commandContext.arguments.message.toString())
    );
  },
};
