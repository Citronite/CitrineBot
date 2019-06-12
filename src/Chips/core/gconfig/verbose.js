const { SubCommand } = require('../../../exports');

class Verbose extends SubCommand {
  constructor() {
    super({
      name: 'verbose',
      description: 'View or toggle verbose mode setting.',
      usage: '[p]gconfig verbose ["on" | "off"]'
    });
  }

  async execute(ctx, choice) {
    if (choice) {
      if (choice.toLowerCase() === 'on') {
        ctx.client.settings.verbose = true;
      } else if (choice.toLowerCase() === 'off') {
        ctx.client.settings.verbose = false;
      } else {
        await ctx.error('Please choose "on" or "off" to control verbose mode.');
        return;
      }
      await ctx.client.settings.save();
      await ctx.success(`Verbose mode is now **\`${choice.toUpperCase()}\`**`);
      return;
    } else {
      await ctx.send(
        `Verbose mode is currently **\`${
          ctx.client.settings.verbose ? 'ON' : 'OFF'
        }\`**`
      );
      return;
    }
  }
}

module.exports = new Verbose();
