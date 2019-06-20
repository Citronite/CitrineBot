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
      choice = choice.toLowerCase();
      if (!['on', 'off'].includes(choice)) {
        ctx.error('Please specify `on` or `off`');
      } else {
        ctx.settings.verbose = setting === 'on' ? true : false;
        await ctx.client.settings.save();
        ctx.success(`Verbose mode is now \`${choice.toUpperCase()}\``);
      }
    } else {
      ctx.send(`Verbose mode is currently \`${ctx.client.settings.verbose ? 'ON' : 'OFF'}\``);
    }
  }
}

module.exports = new Verbose();
