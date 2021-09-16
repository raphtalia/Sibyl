import type { GuildMember, Message, User } from 'discord.js';

export type CommandExecutor = (
	user: User | GuildMember,
	message: Message,
	args: string[]
) => Promise<void>;

export default CommandExecutor;
