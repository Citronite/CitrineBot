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
    const { lastException } = ctx.client;
    if (lastException) {
      const msg = `\`\`\`js\n${JSON.stringify(lastException, null, '\t')}\n\`\`\``;
      ctx.send(QuickEmbed.error(msg).setTitle('Last Exception:'));
    }
    else {
      ctx.success('No exceptions!')
    }
  }
}

module.exports = new Exception();
