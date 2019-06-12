const { BaseCommand, QuickEmbed } = require('../../exports');

class Help extends BaseCommand {
  constructor() {
    super({
      name: 'help',
      description: 'Help command',
      usage: '[p]help [command]',
      chip: 'core'
    });
  }

  async execute(ctx, ...args) {
    if (args.length) {
      const result = ctx.client.cmdHandler.getFinalCmd(
        ctx.message,
        Array.from(args)
      );
      if (!result) {
        ctx.send(`Unable to find command: \`${args.join(' ')}\``);
      } else {
        const [cmd] = result;
        ctx.send(QuickEmbed.cmdHelp(ctx, cmd));
      }
    } else {
      ctx.send("Hi! I'm an instance of Citrine!");
    }
  }
}

module.exports = new Help();
