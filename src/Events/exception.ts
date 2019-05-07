import { BaseCommand } from '../Structures/CommandStructs/BaseCommand';
import { SubCommand } from '../Structures/CommandStructs/SubCommand';
import { Exception } from '../Structures/ErrorStructs/Exception';
import { CitrineClient } from '../Structures/CitrineClient';
import { QuickEmbed } from '../Utils/QuickEmbed';
import { Context } from '../Utils/Context';

type tCommand = BaseCommand | SubCommand;

module.exports = {
  name: 'exception',
  listener: async (client: CitrineClient, error: Exception, ctx?: Context, cmd?: tCommand) => {
    if (ctx && cmd && [200, 201, 202].includes(error.code)) {
      await ctx.send(QuickEmbed.cmdHelp(ctx, cmd));
      return;
    }

    if (ctx && client.settings.verbose) await ctx.send(error.toEmbed());
    if (error.code === 999) client.logger.error(error);
    client.lastException = error;
  }
};
