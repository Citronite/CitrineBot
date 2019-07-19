import { BaseCommand } from '../../exports.js';
import { QuickEmbed } from '../../exports.js';
import Context from '../../Structures/Utils/Context.js';

class Exception extends BaseCommand {
  public constructor() {
    super({
      name: 'err',
      description: 'View last exception tracked by the bot, if any',
      usage: '[p]err',
      chip: 'dev'
    });
  }

  public async execute(ctx: Context) {
    ctx.lock('botDev');
    const { lastException } = ctx.client;
    if (lastException) {
      const cls = lastException.constructor.name;
      const msg = `\`\`\`js\n[${cls}]\n${JSON.stringify(lastException, null, '  ')}\n\`\`\``;
      return ctx.send(QuickEmbed.error(msg).setTitle('Last Exception:'));
    } else {
      return ctx.success('No exceptions!');
    }
  }
}

module.exports = new Exception();
