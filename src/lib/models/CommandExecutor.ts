import type CommandContext from '../classes/CommandContext';

export type CommandExecutor = (context: CommandContext) => Promise<void>;

export default CommandExecutor;
