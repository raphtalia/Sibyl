import constants from "../constants";
import getModules from "../util/getModules";
import path from "path";

class commandHandler {
  constructor(bot) {
    const commandsPath = constants.COMMANDS_PATH;
    const commandService = bot.services.commandService;

    getModules(commandsPath).forEach((module) => {
      try {
        const handler = require(path.resolve(`${commandsPath}/${module.path}`));
        commandService.registerCommand(handler);
      } catch (e) {
        console.error(e);
      }
    });

    commandService.reloadSlashCommands();
  }
}

export = commandHandler;
