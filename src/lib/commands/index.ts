import type Command from '../classes/Command';

import ping from './Ping';

const commands: { [name: string]: Command } = { ping };

export default commands;
