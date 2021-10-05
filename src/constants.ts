export = {
  HANDLERS_PATH: "./handlers",
  SERVICES_PATH: "./services",
  COMMANDS_PATH: "./commands",

  COMMAND_PREFIX: "!",

  ERRORS: {
    TYPO_COMMAND: "**{}** is not a command, the most similar command is **{}**, or run **!help** for help.",
    UNKNOWN_COMMAND: "Invalid command, run **!help** for help.",
    SLASH_ONLY_COMMAND: "This command can only be used as a slash command.",
  },

  COMMAND_FUZZY_CONFIDENCE: 0.4,
};
