import { BaseCommand } from '../../exports';

class Ping extends BaseCommand {
  constructor() {
    super({
      name: 'ping',
      description: 'Check bot ping!',
      usage: '[p]ping'
    });
  }

  execute(ctx) {
    ctx.send(`**Pong!**\n${Math.floor(ctx.client.ping)}ms`);
  }
}

module.exports = new Ping();
