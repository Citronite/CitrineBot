import { Context } from '../Utils/Context';
import { CommandError } from '../Structures/ErrorStructs/CommandError';
import { QuickEmbed } from '../Utils/QuickEmbed';

module.exports = {
	name: 'commandError',
	maxListeners: '1',
	listener: (ctx: Context, error: CommandError): void => {
    if ([200, 201, 202].includes(error.code)) {
      ctx.send(QuickEmbed.commandHelp(ctx, error.cmd));
      return;
    }
    ctx.send(error.toEmbed());
	}
};
