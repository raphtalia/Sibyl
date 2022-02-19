import Command from '../classes/Command';

export default new Command(
	{
		name: 'ping',
		description: 'pong!'
	},
	async (context) => {
		context.message.reply('pong!');
	}
);
