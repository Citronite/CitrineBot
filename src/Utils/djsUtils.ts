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

/**
 * Extra djs-related utility functions.
 */
export class DjsUtils {
	constructor() {
		throw new Error('This class may not be instantiated!');
	}

	public static escapeMarkdown(text: string, onlyCodeBlock?: boolean, onlyInlineCode?: boolean): string {
		return Util.escapeMarkdown(text, onlyCodeBlock, onlyInlineCode);
	}

	public static async fetchRecommendedShards(token: string, guildsPerShard?: number): Promise<number> {
		return Util.fetchRecommendedShards(token, guildsPerShard);
	}

	public static splitMessage(text: string, options?: SplitOptions): string | string[] {
		return Util.splitMessage(text, options);
	}

	public static deconstructSnowflake(snowflake: string): DeconstructedSnowflake {
		return SnowflakeUtil.deconstruct(snowflake);
	}

	public static generateSnowflake(timestamp?: number | Date): Snowflake {
		return SnowflakeUtil.generate(/*timestamp*/);
	}

	public static inlineCode(str: string | string[]): string | string[] {
		if (typeof str === 'string') {
			return `\`${str}\``;
		}
		return str.map(val => `\`${val}\``);
	}

	public static blockCode(str: string | string[], lang: string = ''): string | string[] {
		if (typeof str === 'string') {
			return `\`\`\`${lang}\n${str}\n\`\`\``;
		}
		return str.map(val => `\`\`\`${lang}\n${val}\n\`\`\``);
	}

	public static parseMention(mention: string): string {
		const rgx = /^<(#|@|@!|@&)\d+>$/;
		if (rgx.test(mention)) {
			mention = mention.slice(2, -1);
			if (/^!|&/.test(mention)) mention = mention.slice(1);
		}
		return mention;
	}

	public static parseQuotes(text: string): (string | undefined)[] {
		const matches = text.match(/".*?"/g);
		if (!matches || !matches.length) return text.split(/ +/);
		const tmp = ` ${Date.now()}`;
		return text.replace(/".*?"/g, tmp).split(/ +/).map(val => val === tmp ? matches.shift() : val).filter(Boolean);
	}

	public static resolveRole(guild: Guild, role: string): Role | null {
		const parsedRole = DjsUtils.parseMention(role);

		const finder = (val: Role): boolean => {
			if (parsedRole.startsWith('"') && parsedRole.endsWith('"')) {
				return val.name === parsedRole.slice(1,-1);
			} else {
				return val.name === parsedRole;
			}
		};

		return guild.roles.get(parsedRole) || guild.roles.find(finder) || null;
	}

	public static resolveGuildChannel(guild: Guild, channel: string): GuildChannel | null {
		const parsedChnl = DjsUtils.parseMention(channel);

		const finder = (val: GuildChannel): boolean => {
			if (val.name === parsedChnl) return true;
			if (parsedChnl.startsWith('#') && (val.name === parsedChnl.slice(1))) return true;
			return false;
		};

		return guild.channels.get(parsedChnl) || guild.channels.find(finder) || null;
	}

	public static async resolveUser(client: Client, user: string): Promise<User | null> {
		const parsedUser = DjsUtils.parseMention(user);
		try {
			const fetched = await client.fetchUser(parsedUser);
			return fetched || null;
		}	catch(err) {
			const tsIsDumb: any = client;
			tsIsDumb.logger.warn(`<Client>.fetchUser() failed for [${user}]`);
			return null;
		}
	}

	public static async resolveGuildMember(guild: Guild, member: string): Promise<GuildMember | null> {
		const parsedMember = DjsUtils.parseMention(member);

		try {
			const fetched = await guild.fetchMember(parsedMember);
			if (fetched) return fetched;

			const fetchedGuild = await guild.fetchMembers(parsedMember, 5);
			const rgx = new RegExp(`${parsedMember}`, 'i');
			const finder = (val: GuildMember) => {
				return val.user.id === parsedMember ||
				val.user.username === parsedMember ||
				val.nickname === parsedMember ||
				val.user.tag === parsedMember ||
				rgx.test(val.user.username) ||
				rgx.test(val.nickname);
			};

			return fetchedGuild.members.find(finder) || null;

		}	catch (err) {
			const client: any = guild.client;
			client.logger.warn(`<Client>.fetchMembers() failed for [${member}]`);
			return null;
		}
	}
}
