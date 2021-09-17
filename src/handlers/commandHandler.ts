import constants from "../constants";
import getModules from "../util/getModules";
import path from "path";

class commandHandler {
  constructor(bot) {
    const commandsPath = constants.COMMANDS_PATH;
    const commandService = bot.services.commandService;

    getModules(commandsPath).forEach((module) => {
      const handler = require(path.resolve(`${commandsPath}/${module.path}`));
      commandService.registerCommand(handler)
    });

    commandService.reloadSlashCommands();
  }
}

export = commandHandler;
