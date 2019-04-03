const { BaseCommand } = require('../../exports');

class CMD extends BaseCommand {
  constructor() {
    super('exception', 'dev-util', {
      description: 'View last exception tracked by the bot',
      usage: '[p]exception'
    });
  }

  execute(ctx) {
    const { lastException } = ctx.client;
    if (lastException) {
      const msg = `\`\`\`js\n${JSON.stringify(lastException, null, '  \n')}\n\`\`\``;
      ctx.error(msg);
    }
    else {
      ctx.success('No exceptions!')
    }
  }
}

module.exports = new CMD();
