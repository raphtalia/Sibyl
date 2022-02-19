import { Guild } from 'discord.js';

import { COMMAND_PREFIX } from '../constants';

export default class Server {
	public readonly guild: Guild;

	constructor(guild: Guild) {
		this.guild = guild;
	}

	public getCommandPrefix(): string {
		// TODO: Implement database fetching
		return COMMAND_PREFIX;
	}
}
