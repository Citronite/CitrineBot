const { BaseCommand } = require('../../exports');

class CMD extends BaseCommand {
  constructor() {
    super('ping', 'core', {
      description: 'Check bot ping!',
      usage: '[p]ping'
    });
  }

  execute(ctx) {
    ctx.send(`**Pong!**\n${Math.floor(ctx.client.ping)}ms`);
  }
}

module.exports = new CMD();
