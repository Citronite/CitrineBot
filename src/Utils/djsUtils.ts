import { Util,
	SnowflakeUtil,
	SplitOptions,
	Snowflake,
	DeconstructedSnowflake,
	Role,
	Guild,
	Client,
	User,
	GuildChannel,
	GuildMember
} from 'discord.js';

export class DjsUtils {
	constructor() {
		throw new Error('This class may not be instantiated!');
	}

	public static escapeMarkdown(text: string, onlyCodeBlock?: boolean, onlyInlineCode?: boolean): string {
		return Util.escapeMarkdown(text, onlyCodeBlock, onlyInlineCode);
	}

	static fetchRecommendedShards(token: string, guildsPerShard?: number): Promise<number> {
		return Util.fetchRecommendedShards(token, guildsPerShard);
	}

	static splitMessage(text: string, options?: SplitOptions): string | string[] {
		return Util.splitMessage(text, options);
	}

	static deconstructSnowflake(snowflake: string): DeconstructedSnowflake {
		return SnowflakeUtil.deconstruct(snowflake);
	}

	static generateSnowflake(timestamp?: number | Date): Snowflake {
		return SnowflakeUtil.generate(/**timestamp**/);
	}

	static inlineCode(str: string | string[]): string | string[] {
		if (typeof str === 'string') {
			return `\`${str}\``;
		}
		return str.map(v => `\`${v}\``);
	}

	static blockCode(str: string | string[], lang: string = ''): string | string[] {
		if (typeof str === 'string') {
			return '```' + `${lang}\n${str}\n` + '```';
		}
		return str.map(v => '```' + `${lang}\n${v}\n` + '```');
	}

	static parseMention(mention: string): string {
		if ((mention.startsWith('<@') || mention.startsWith('<#')) && mention.endsWith('>')) {
			mention = mention.slice(2, -1);
			if (mention.startsWith('!')) mention = mention.slice(1);
			if (mention.startsWith('&')) mention = mention.slice(1);
		}
		return mention;
	}

	static parseQuotes(text: string): (string | undefined)[] {
		const matches = text.match(/".*?"/g);
		if (!matches || !matches.length) return text.split(/ +/);
		const tmp = ' ' + Date.now().toString();
		return text.replace(/".*?"/g, tmp).split(/ +/).map(v => v === tmp ? matches.shift() : v).filter(Boolean);
	}

	static resolveRole(guild: Guild, role: string): Role | null {
		const parsedRole = DjsUtils.parseMention(role);
		if (guild.roles.has(parsedRole)) {
			return guild.roles.get(parsedRole) || null;
		}
		else {
			return guild.roles.find(r => r.name === parsedRole) || null;
		}
	}

	static async resolveUser(client: Client, user: string): Promise<User | null> {
		const parsedUser = DjsUtils.parseMention(user);
		try {
			const fetched = await client.fetchUser(parsedUser);
			return fetched || null;
		}
		catch(err) {
			// client.logger.warn(`<Client>.fetchUser() failed for [${user}]`);
			return null
		}
	}

	static resolveGuildChannel(guild: Guild, channel: string): GuildChannel | null {
		const parsedChnl = DjsUtils.parseMention(channel);

		const finder = (v: GuildChannel): boolean => {
			if (v.name === parsedChnl) return true;
			if (parsedChnl.startsWith('#') && (v.name === parsedChnl.slice(1))) return true;
			return false;
		}

		return guild.channels.get(parsedChnl) || guild.channels.find(finder) || null;
	}

	static async resolveGuildMember(guild: Guild, member: string): Promise<GuildMember | null> {
		const parsedMember = DjsUtils.parseMention(member);
		try {
			const fetched = await guild.fetchMember(parsedMember);
			if (fetched) return fetched;

			const fetchedGuild = await guild.fetchMembers(parsedMember, 5);
			const finder = (v: GuildMember) => {
				return v.user.id === parsedMember ||
				v.user.username === parsedMember ||
				v.nickname === parsedMember ||
				v.user.tag === parsedMember
			}
			return fetchedGuild.members.find(finder) || null;
		}
		catch (err) {
			// guild.client.logger.warn(`<Client>.fetchMembers() failed for [${member}]`);
			return null;
		}
	}
}
