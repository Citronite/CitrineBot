import BaseCommand from '../Structures/Command/BaseCommand';
import SubCommand from '../Structures/Command/SubCommand';
import Exception from '../Structures/Exceptions/Exception';
import CitrineClient from '../Structures/CitrineClient';
import QuickEmbed from '../Structures/Utils/QuickEmbed';
import Context from '../Structures/Utils/Context';

type Command = BaseCommand | SubCommand;

/**
 * These errors are not logged to the console
 * 101 - MISSING_BOT_PERMS
 * 102 - MISSING_MEMBER_PERMS
 * 103 - FAILED_FILTER_CHECKS
 * 201 - INSIFFICIENT_ARGS
 * 202 - INVALID_ARGS
 */
const ignored = [101, 102, 103, 201, 202];

module.exports = {
  name: 'exception',
  listener: async (client: CitrineClient, error: Exception, ctx?: Context, cmd?: Command) => {
    if (ctx) {
      if (cmd && error.code === 201) {
        await ctx.send(QuickEmbed.cmdHelp(ctx, cmd));
      } else if (client.settings.verbose) {
        await ctx.send(error.toEmbed());
      } else {
        ctx.send(
          QuickEmbed.error('Unknown error occurred!').setFooter(
            '⛔ Check console for more details!'
          )
        );
      }
    }

    if (ignored.includes(error.code)) return;
    else {
      client.logger.error(error);
      client.lastException = error;
    }
  }
};
