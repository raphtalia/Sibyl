export = {
  name: "echo",
  description: "Echo a message.",
  arguments: [
    {
      name: "message",
      type: "STRING",
      multiple: true,
    },
  ],

  async execute(commandContext) {
    commandContext.message.reply('test')
  }
}