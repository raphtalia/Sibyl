import parser from "discord-command-parser";

export = class commandService {
  commands = {};

  constructor(bot) {
    console.log("[CommandService] Initializing...");
    bot.client.on("messageCreate", async (msg) => {
      console.log(Object.getOwnPropertyNames(msg));
    });
  }
};
