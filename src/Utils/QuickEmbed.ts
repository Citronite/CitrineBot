import { RichEmbed, User, GuildMember } from 'discord.js';
import { Colors } from './Constants';
import { Command } from '../Structures/CommandStructs/AbstractCommand';
import { Context } from './Context';

export class QuickEmbed {
  constructor() {
    throw new Error('This class may not be instantiated with the new keyword');
  }

  public static error(info: string = 'An unknown error occurred!'): RichEmbed {
    return new RichEmbed().setColor(Colors.RED)
      .setDescription(`⛔ ${info}`)
      .setFooter('This wasn\'t supposed to happen...')
      .setTimestamp();
  }

  public static success(info: string = 'Success!'): RichEmbed {
    return new RichEmbed().setColor(Colors.GREEN)
      .setDescription(`✅ ${info}`)
      .setFooter('Yay!')
      .setTimestamp();
  }

  public static basic(user: User | GuildMember): RichEmbed {
    if (user instanceof GuildMember) {
      const color = user.displayColor;

      return new RichEmbed().setTimestamp()
        .setFooter(`Requested by ${user.user.username}`, user.user.avatarURL)
        .setColor(color);
    } else {
      const color = Colors.BOT;
      return new RichEmbed().setTimestamp()
        .setFooter(`Requested by ${user.username}`, user.avatarURL)
        .setColor(color);
    }
  }

  public static commandHelp(ctx: Context, cmd: Command): RichEmbed {
    const embed = this.basic(ctx.message.member || ctx.author);
    const help = ctx.client.utils.format.commandHelp(cmd);

    embed.setTitle(help.name)
      .setDescription(help.description)
      .addField('Chip', help.chip, true)
      .addField('Base Command', help.base, true);

    if (help.usage) embed.addField('Usage', help.usage.replace('[p]', ctx.prefix), false);
    if (help.subcommands) embed.addField('SubCommands', help.subcommands, false);

    return embed;
  }

}
