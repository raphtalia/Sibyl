import type { GuildMember, Message, User } from 'discord.js';
import type CommandArgument from '../models/CommandArgument';
import type CommandExecutor from '../models/CommandExecutor';

export default class Command {
	public readonly name: string;
	public readonly description: string;
	public readonly slashOnly: boolean;
	public readonly arguments: CommandArgument[];
	public readonly subcommands: Command[];
	protected callbackFn: CommandExecutor;

	constructor(
		options: {
			name: string;
			description?: string;
			slashOnly?: boolean;
			arguments?: CommandArgument[];
			subcommands?: Command[];
		},
		callbackFn: CommandExecutor
	) {
		this.name = options.name;
		this.description = options.description || '';
		this.slashOnly = options.slashOnly || false;
		this.arguments = options.arguments || [];
		this.subcommands = options.subcommands || [];
		this.callbackFn = callbackFn;
	}

	public async execute(user: User | GuildMember, message: Message, args: string[]): Promise<this> {
		try {
			await this.callbackFn(user, message, args);
		} catch (e) {
			console.error(e);
		}

		return this;
	}
}
