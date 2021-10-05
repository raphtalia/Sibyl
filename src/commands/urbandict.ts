import { CommandContext } from "../types";
import { MessageEmbed } from "discord.js";
import promiseReplace from "../util/promiseReplace";

import urbandict from "urban-dictionary";
import datefns from "date-fns";

const DEFINITIONS_REGEX = /\[[^[\]]+]/gm;

console.log(datefns.format)
console.log(datefns.parse)

async function define(term): Promise<any> {
  try {
    return (await urbandict.define(term))[0];
  } catch {
    return null;
  }
}

async function embedDefinitions(text: string): Promise<string> {
  return promiseReplace(text, DEFINITIONS_REGEX, async (match) => {
    try {
      const term = match.slice(1, -1);
      return `[${term}](${(await define(term)).permalink})`;
    } catch (e) {
      return match;
    }
  });
}

export = {
  name: "urbandict",
  description: "Looks up the definition of a term on Urban Dictionary",
  arguments: [
    {
      name: "term",
      description: "Term to define",
      type: "STRING",
      required: true,
      multiple: true,
    },
  ],

  async execute(commandContext: CommandContext) {
    const term = commandContext.arguments.term;
    const definition = await define(term);

    if (definition) {
      let embed = new MessageEmbed()
        .setTitle(definition.word)
        .setURL(definition.permalink)
        .setFooter(`${definition.author} · ${datefns.format(datefns.parse(definition.written_on, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", new Date()), "LLLL d, y")}`)
        .setDescription(
          `${await embedDefinitions(
            definition.definition
          )}\n\n${await embedDefinitions(definition.example)}`
        );

      commandContext.message.reply({ embeds: [embed] });
    } else {
      commandContext.message.reply(`No definition found for **${term}**`);
    }
  },
};
