const { BaseCommand } = require('../../exports.js');
const { QuickEmbed } = require('../../exports.js');

class Exception extends BaseCommand {
  constructor() {
    super('exception', 'dev-utils', {
      description: 'View last exception tracked by the bot',
      usage: '[p]exception'
    });
  }

  execute(ctx) {
    ctx.checkBotDev();

    const { lastException } = ctx.client;
    if (lastException) {
      const cls = lastException.constructor.name;
      const msg = `\`\`\`js\n[${cls}]\n${JSON.stringify(lastException, null, '\t')}\n\`\`\``;
      ctx.send(QuickEmbed.error(msg).setTitle('Last Exception:'));
    }
    else {
      ctx.success('No exceptions!')
    }
  }
}

module.exports = new Exception();
