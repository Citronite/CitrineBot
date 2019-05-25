const { BaseCommand, QuickEmbed } = require('../../exports');

class Help extends BaseCommand {
  constructor() {
    super({
      name: 'help',
      description: 'Help command',
      usage: '[p]help [command]'
    }, 'core');
  }

  async execute(ctx, ...args) {
    if (args.length) {
      const [cmd,] = ctx.client.cmdHandler.getFinalCmd(ctx.message, args);
      if (!cmd) {
        ctx.send(`Unable to find command: \`${args}\``);
      } else {
        ctx.send(QuickEmbed.cmdHelp(ctx, cmd));
      }
    } else {
      ctx.send('Hi! I\'m an instance of Citrine!');
    }
  }
}

module.exports = new Help();
