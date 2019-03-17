import { RichEmbed, User, GuildMember } from 'discord.js';
import { Colors } from './Constants';
import { Command } from '../Structures/CommandStructs/AbstractCommand';
import { SubCommand } from '../Structures/CommandStructs/SubCommand';
import { BaseCommand } from '../Structures/CommandStructs/BaseCommand';
import { Context } from './Context';

export class QuickEmbed {
	constructor() {
		throw new Error('This class may not be instantiated with new');
	}

	public static error(info: string = 'An unknown error occurred!', type: string = 'UNKNOWN:666'): RichEmbed {
		return new RichEmbed().setColor(Colors.RED)
			.setDescription(`⛔ ${info}`)
			.setFooter(`Error: ${type}`)
			.setTimestamp();
	}

	public static success(info: string = 'Success!'): RichEmbed {
		return new RichEmbed().setColor(Colors.GREEN)
			.setDescription(`✅ ${info}`)
			.setFooter('Yay!')
			.setTimestamp();
	}

	public static base(user: User | GuildMember): RichEmbed {
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

	public static commandHelp(ctx: Context, cmd: SubCommand | BaseCommand): RichEmbed {
		const embed = this.base(ctx.message.member || ctx.author);
		const baseCmd = cmd instanceof SubCommand ? cmd.getBase() : cmd;
		const module = baseCmd ? baseCmd.module : '--/--';
		const baseName = baseCmd ? baseCmd.name : '--/--';

		embed.setTitle(cmd.name)
			.setDescription(cmd.description)
			.addField('Module', module, true)
			.addField('Base Command', baseName, true);

		if (cmd.usage) {
			const codeblock = `\`\`\`\n${cmd.usage}\n\`\`\``;
			embed.addField('Command Usage', codeblock, false);
		}

		if (cmd.subcommands) {
			const names = [];
			const descrips = [];
			const final = [];

			for (const [key, val] of cmd.subcommands) {
				names.push(key);
				descrips.push(val.description);
			}

			const longest = names.reduce((acc, cur) => acc > cur.length ? acc : cur.length, 0);

			for (let x = 0; x <= names.length; x++) {
				const str = names[x].padEnd(longest + 2) + descrips[x];
				final.push(str);
			}

			const codeblock = `\`\`\`\n${final.join('\n')}\`\`\``;
			embed.addField('SubCommands', codeblock);
		}

		return embed;
	}

}
