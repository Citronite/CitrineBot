import { Context } from '../Utils/Context';
import { CommandError } from '../Structures/ErrorStructs/CommandError';

module.exports = {
	name: 'commandError',
	maxListeners: '1',
	listener: (ctx: Context, error: CommandError): void => {
		ctx.send(error.toEmbed());
	}
};
