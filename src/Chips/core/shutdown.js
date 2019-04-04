const { BaseCommand } = require('../../exports');

class Shutdown extends BaseCommand {
  constructor() {
    super({
      name: 'shutdown',
      description: 'Shuts down the bot, with a zero exit code.',
      usage: '[p]shutdown'
    }, 'core');
  }

  async execute(ctx) {
    ctx.checkBotOwner();
    await ctx.send('Shutting down...');
    await ctx.client.settings.save();
    process.exit(0);
  }
}

module.exports = new Shutdown();
