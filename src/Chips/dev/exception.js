const { BaseCommand } = require('../../exports.js');
const { QuickEmbed } = require('../../exports.js');

class Exception extends BaseCommand {
  constructor() {
    super({
      name: 'exception',
      description: 'View last exception tracked by the bot',
      usage: '[p]exception',
      chip: 'dev'
    });
  }

  async execute(ctx) {
    ctx.lock('botDev');
    const { lastException } = ctx.client;
    if (lastException) {
      const cls = lastException.constructor.name;
      const msg = `\`\`\`js\n[${cls}]\n${JSON.stringify(
        lastException,
        null,
        '  '
      )}\n\`\`\``;
      ctx.send(QuickEmbed.error(msg).setTitle('Last Exception:'));
    } else {
      ctx.success('No exceptions!');
    }
  }
}

module.exports = new Exception();
