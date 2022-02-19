import type { GuildMember, Message, User } from 'discord.js';

export default class CommandContext {
	public readonly invoker: User | GuildMember;
	public readonly message: Message;
	public readonly arguments: string[];

	constructor(invoker: User | GuildMember, msg: Message, args: string[]) {
		this.invoker = invoker;
		this.message = msg;
		this.arguments = args;
	}
}
