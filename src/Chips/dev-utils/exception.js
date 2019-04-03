const { BaseCommand } = require('../../exports');

class CMD extends BaseCommand {
  constructor() {
    super({
      name: 'exception',
      description: 'View the last exception tracked by the bot.',
      usage: '[p]exception'
    });
  }

  execute(ctx) {
    const { lastException } = ctx.client;
    const msg = `\`\`\`js\n${JSON.stringify(lastException, null, '  \n')}\n\`\`\``;
    ctx.send(msg);
  }
}

module.exports = new CMD();
