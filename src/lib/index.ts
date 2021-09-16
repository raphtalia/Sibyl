import { Client } from 'discord.js';

import { INTENTS } from './constants';
import { uniq_fast } from './util';

import Service from './classes/Service';
import services from './services';

// require("discord-reply");

export default class Sibyl {
	public readonly services: { [name: string]: Service } = services;
	public readonly client: Client;

	constructor(intents: number[] = []) {
		this.client = new Client({
			intents: uniq_fast(intents.concat(INTENTS))
		});
	}

	public start(apiKey: string): Promise<this> {
		return new Promise(async (resolve, reject) => {
			try {
				this.client.login(apiKey);

				await Promise.all(
					Object.values(this.services).map((service) => {
						return service.start(this);
					})
				);

				resolve(this);
			} catch (e) {
				console.error(e);
				reject(e);
			}
		});
	}

	public registerService(service: Service): this {
		if (this.services[service.name]) {
			throw new Error(`Service ${service.name} already registered`);
		}

		this.services[service.name] = service;

		return this;
	}

	// Event forwarding
	public on(event: string, listener: (...args: any[]) => void): this {
		this.client.on(event, listener);
		return this;
	}

	public once(event: string, listener: (...args: any[]) => void): this {
		this.client.once(event, listener);
		return this;
	}
}
