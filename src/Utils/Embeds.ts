import { RichEmbed, User, GuildMember } from 'discord.js';
import { Colors } from './Constants';

export class Embed {
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

	public static alert(info: string = 'The developers of this bot are not responsible for any damage!'): RichEmbed {
		return new RichEmbed().setColor(Colors.YELLOW)
			.setDescription(`⚠ ${info}`)
			.setTimestamp();
	}

	public static common(user: User | GuildMember): RichEmbed {
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

}
