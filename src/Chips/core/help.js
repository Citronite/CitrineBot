const { BaseCommand, QuickEmbed } = require('../../exports');

class Help extends BaseCommand {
  constructor() {
    super({
      name: 'help',
      description: 'Help command',
      usage: '[p]help [command]'
    }, 'core');
  }

  async execute(ctx, arg) {
    if (cmd) {
      const finder = (val) => {
        const aliases = ctx.client.settings.aliases[val.name];
        return aliases && aliases.includes(name);
      };
      const cmd = ctx.client.commands.get(arg)
        || ctx.client.commands.find(finder);

      if (!cmd) {
        ctx.send(`Unable to find command: \`${arg}\``);
      } else {
        ctx.send(QuickEmbed.cmdHelp(ctx, cmd));
      }
    } else {
      ctx.send('Hi! I\'m an instance of Citrine!');
    }
  }
}
