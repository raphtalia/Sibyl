import { Client } from "discord.js";

export type Bot = {
  client: Client;
  services: any;
};

export type Command = {
  name: string;
  description: string;
  arguments: commandArgument[];
};

export type commandArgument = {
  name: string;
  description: string;
  required: boolean;
  type: string;
  multiple: boolean;
};
