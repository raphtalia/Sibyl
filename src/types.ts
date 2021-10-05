import { Channel, Client, CommandInteraction, Message, Role, User } from "discord.js";

export type Bot = {
  client: Client;
  services: any;
};

export type CommandContext = {
  bot: Bot;
  message: Message | CommandInteraction;
  arguments: { [key: string]: boolean | Channel | number | User | Role | string };
}

export type Command = {
  name: string;
  description?: string;
  slashOnly?: boolean;
  arguments?: CommandArgument[];
  subcommands?: Command[];
  execute: (commandContext: CommandContext) => void;
};

export type CommandArgument = {
  name: string;
  description?: string;
  required?: boolean;
  type?: string;
  choices?: CommandArgumentChoice[];
  multiple?: boolean;
};

export type CommandArgumentChoice = {
  label: string;
  value: number | string;
}