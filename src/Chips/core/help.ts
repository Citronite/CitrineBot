import Context from "../../Structures/Utils/Context";
import { BaseCommand, QuickEmbed } from '../../exports';

class Help extends BaseCommand {
  public constructor() {
    super({
      name: 'help',
      description: 'Help command',
      usage: '[p]help [command]',
      chip: 'core'
    });
  }

  public async execute(ctx: Context, ...args: string[]) {
    if (args.length) {
      const result = ctx.client.cmdHandler.getFinalCmd(ctx.message, args);
      if (!result) {
        return ctx.error(`Unable to find command: \`${args.join(' ')}\``);
      } else {
        const [cmd] = result;
        return ctx.send(QuickEmbed.cmdHelp(ctx, cmd));
      }
    } else {
      const embed = QuickEmbed.basic(ctx.member || ctx.author);
      embed.setTitle(ctx.client.user.tag);
      embed.setDescription("Hi! I'm an instance of Citrine!");
      return ctx.send(embed);
    }
  }
}

module.exports = new Help();
