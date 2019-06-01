import { BaseCommand } from '../Structures/CommandStructs/BaseCommand';
import { SubCommand } from '../Structures/CommandStructs/SubCommand';
import { Exception } from '../Structures/ErrorStructs/Exception';
import { CitrineClient } from '../Structures/CitrineClient';
import { QuickEmbed } from '../Utils/QuickEmbed';
import { Context } from '../Utils/Context';

type tCommand = BaseCommand | SubCommand;

// These errors are not logged to the console
const ignored = [100, 101, 102, 103, 200, 201, 202];

module.exports = {
  name: 'exception',
  listener: async (client: CitrineClient, error: Exception, ctx?: Context, cmd?: tCommand) => {
    if (ctx) {
      if (cmd && (error.code === 201)) {
        await ctx.send(QuickEmbed.cmdHelp(ctx, cmd));
      } else if (client.settings.verbose) {
        await ctx.send(error.toEmbed());
      } else {
        ctx.send(QuickEmbed.error('Unknown error occurred!').setFooter('\⛔ Check console for more details!'));
      }
    }

    if (ignored.includes(error.code)) return;
    client.logger.error(error);
    client.lastException = error;
  }
};
