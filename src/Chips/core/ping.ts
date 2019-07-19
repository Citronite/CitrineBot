import { BaseCommand } from '../../exports';
import Context from '../../Structures/Utils/Context';

class Ping extends BaseCommand {
  public constructor() {
    super({
      name: 'ping',
      description: 'Check bot ping!',
      usage: '[p]ping',
      chip: 'core'
    });
  }

  public async execute(ctx: Context) {
    await ctx.send(`🏓 **Pong!** ${Math.floor(ctx.client.ping)}ms`);
  }
}

module.exports = new Ping();
