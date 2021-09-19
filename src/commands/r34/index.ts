import { CommandContext } from "../../types"
import e621 from "./e621"
// import furaffinity from "./furaffinity"
// import reddit from "./reddit"

export = {
  name: "r34",
  description: "Sends an R34 image",
  subcommands: [ e621 ],
  slashOnly: true,

  async execute(commandContext: CommandContext) {
    commandContext.message.reply(commandContext.arguments.message.toString())
  }
}