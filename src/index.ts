import constants from "./constants";

import Discord from "discord.js";
import dotenv from "dotenv";
import getModules from "./util/getModules";

dotenv.config({ path: ".env" });
process.chdir(__dirname);

const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    // Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    // Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    Discord.Intents.FLAGS.GUILDS,
    // Discord.Intents.FLAGS.GUILD_BANS,
    // Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    // Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
    // Discord.Intents.FLAGS.GUILD_INVITES,
    // Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    // Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    // Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
    // Discord.Intents.FLAGS.GUILD_PRESENCES,
    // Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    // Discord.Intents.FLAGS.GUILD_WEBHOOKS,
  ],
  partials: ["CHANNEL"],
});
const services = {};
const handlers = {};

client
  .on("ready", () => {
    console.log("[Sibyl] Initializing");

    const servicesPath = constants.SERVICES_PATH;
    getModules(servicesPath).forEach((module) => {
      const service = require(`${servicesPath}/${module.path}`);
      services[module.name] = new service({
        client: client,
      });
    });

    const handlersPath = constants.HANDLERS_PATH;
    getModules(handlersPath).forEach((module) => {
      const handler = require(`${handlersPath}/${module.path}`);
      handlers[module.name] = new handler({
        client: client,
        services: services,
      });
    });
  })
  .on("error", (e) => {
    console.error(e);
  })
  .on("warn", () => {
    console.warn();
  })
  .on("disconnect", () => {
    console.info();
  });

client.login(process.env.DISCORD_API_KEY);
