import { RichEmbed, User, GuildMember } from 'discord.js';
import { Command } from '../Structures/Command/AbstractCommand';
import { Context } from './Context';

const Colors: { [key: string]: number } = {
  RED: 0xcb4154,
  GREEN: 0x00ff40,
  BOT: 0x9dffbe
};

export class QuickEmbed {
  public static error(info: string = 'An unknown error occurred!'): RichEmbed {
    return new RichEmbed()
      .setColor(Colors.RED)
      .setDescription(info)
      .setFooter('⛔')
      .setTimestamp();
  }

  public static success(info: string = 'Success!'): RichEmbed {
    return new RichEmbed()
      .setColor(Colors.GREEN)
      .setDescription(info)
      .setFooter('✅')
      .setTimestamp();
  }

  public static basic(user: User | GuildMember): RichEmbed {
    if (user instanceof GuildMember) {
      return new RichEmbed()
        .setTimestamp()
        .setFooter(`Requested by ${user.user.username}`, user.user.avatarURL)
        .setColor(user.displayColor);
    } else {
      return new RichEmbed()
        .setTimestamp()
        .setFooter(`Requested by ${user.username}`, user.avatarURL)
        .setColor(Colors.BOT);
    }
  }

  public static cmdHelp(ctx: Context, cmd: Command): RichEmbed {
    const help = ctx.client.utils.format.cmdHelp(cmd);
    const embed = this.basic(ctx.message.member || ctx.author);
    embed
      .setTitle(help.name)
      .setDescription(help.description)
      .addField('Chip', help.chip, true)
      .addField('Base Command', help.base, true);

    if (help.usage)
      embed.addField('Usage', help.usage.replace('[p]', ctx.prefix), false);
    if (help.subcommands)
      embed.addField('SubCommands', help.subcommands, false);
    return embed;
  }
}
