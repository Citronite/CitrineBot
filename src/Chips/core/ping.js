const { BaseCommand } = require('../../exports');

class Ping extends BaseCommand {
  constructor() {
    super({
      name: 'ping',
      description: 'Check bot ping!',
      usage: '[p]ping'
    }, 'core');
  }

  async execute(ctx) {
    await ctx.send(`🏓 **Pong!**\n${Math.floor(ctx.client.ping)}ms`);
  }
}

module.exports = new Ping();
