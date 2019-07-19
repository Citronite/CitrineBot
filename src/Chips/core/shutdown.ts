import { BaseCommand } from '../../exports';
import Context from '../../Structures/Utils/Context';

class Shutdown extends BaseCommand {
  public constructor() {
    super({
      name: 'shutdown',
      description: 'Shuts down the bot, with a zero exit code.',
      usage: '[p]shutdown',
      chip: 'core'
    });
  }

  public async execute(ctx: Context) {
    ctx.lock('botOwner');
    await ctx.send('Goodbye 👋');
    await ctx.client.settings.save();
    process.exit(0);
  }
}

module.exports = new Shutdown();
