import Command from '../classes/Command';

export default new Command(
	{
		name: 'ping',
		description: 'pong!'
	},
	async (_, message) => {
		message.reply('pong!');
	}
);
