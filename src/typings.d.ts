
declare module 'typings' {

	import { 
		Collection, 
		Client, 
		Message, 
		User, 
		GuildMember, 
		Guild, 
		Channel,
		TextChannel,
		Snowflake,
		MessageReaction,
		PermissionResolvable,
		SplitOptions,
		DeconstructedSnowflake,
		Role,
		GuildChannel
	} from 'discord.js';

	export type GuildID = Snowflake;
	export type ChannelID = Snowflake;
	export type RoleID = Snowflake;
	export type UserID = Snowflake;

	export type CommandOptions = {
		description? : string,
		usage? : string,
	}

	export interface IContext {
		readonly client: Client;
		readonly invokedPrefix: string;
		readonly message: Message;
		readonly author: User;
		readonly channel: Channel;
		success: (msg: string, embed: boolean) => Promise<Message | Message[]>;
		error: (msg: string, type: string, embed: boolean) => Promise<Message | Message[]>;
		confirm: (msg: string, timeOut: number) => Promise<boolean | null>;
		prompt: (msg: string, contentOnly: boolean, timeOut: number) => Promise<Message | string | null>;
		promptReaction: (msg: string, emojis: string[], limit: number, timeOut: number) => Promise<MessageReaction[] | null>;
		send: (...args: any) => Promise<Message | Message[]>;
		reply: (...args: any) => Promise<Message | Message[]>;
		sendDM: (...args: any) => Promise<Message | Message[]>;
	}

	export interface IGuildConfig {
		readonly id: string;
		prefix: string;
		disabledRole: RoleID;
		deleteCmdCalls: boolean;
		deleteCmdCallsDelay: number;
		readMsgEdits: boolean;
		disabledUsers: Set<UserID>;
		disabledChannels: Set<ChannelID>;
		disabledCommands: Set<string>;
		reqRoles: { [cmd in string]: RoleID | undefined };
		setReqRole: (cmd: any, role: RoleID) => void;
		unsetReqRole: (cmd: any) => void;
		toJSON: () => object;
	}

	export interface IGlobalConfig {
		owner: UserID;
		prefix: string;
		devs: Set<UserID>;
		disabledUsers: Set<UserID>;
		disabledGuilds: Set<GuildID>;
		disabledCommands: Set<string>;
		loadedModules: Set<string>;
		aliases: { [cmd in string]: string[] };
	}

	export interface ICmdHandler {
		checkPrefix: (message: any, config: IGuildConfig) => string | null;
		getArgs: (message: any, prefix: string, parseQuotes: boolean) => string[] | null;
		getBaseCmd: (message: any, args: string[]) => [any, string[]] | [null, null];
		getFinalCmd: (message: Message, args: string[]) => [any, string[]] | [null, null];
		processCommand: (message: any, config: IGuildConfig) => Promise<void>;
	}

	export interface IPermHandler {
		checkCustomFilters: (cmd: any, message: Message, client: any) => Promise<boolean>;
		checkDiscordPerms: (channel: TextChannel, member: GuildMember, perms: PermissionResolvable, checkAdmin?: boolean) => void | Error;
		checkManageMessages: (channel: TextChannel, member: GuildMember, checkAdmin?: boolean) => boolean;
		checkBan: (channel: TextChannel, member: GuildMember, checkAdmin?: boolean) => boolean;
		checkKick(channel: TextChannel, member: GuildMember, checkAdmin?: boolean): boolean;
		checkGuildOwner: (guild: Guild, member: GuildMember) => boolean;
		checkBotOwner: (user: User | GuildMember) => boolean;
		checkBotDev: (user: User | GuildMember) => boolean;
	}

	export interface IDjsUtils {
		escapeMarkdown: (text: string, onlyCodeBlock?: boolean, onlyInlineCode?: boolean) => string;
		fetchRecommendedShards: (token: string, guildsPerShard?: number) => Promise<number>;
		splitMessage: (text: string, options?: SplitOptions) => string | string[];
		deconstructSnowflake: (snowflake: string) => DeconstructedSnowflake;
		generateSnowflake: (timestamp?: number | Date) => Snowflake;
		inlineCode: (str: string | string[]) => string | string[];
		blockCode: (str: string | string[], lang?: string) => string | string[];
		parseMention: (mention: string) => string;
		parseQuotes: (text: string) => (string | undefined)[];
		resolveRole: (guild: Guild, role: string) => Role | null;
		resolveGuildChannel: (guild: Guild, channel: string) => GuildChannel | null;
		resolveUser: (client: Client, user: string) => Promise<User | null>;
		resolveGuildMember(guild: Guild, member: string): Promise<GuildMember | null>;
	}

	export interface IJsUtils {
		cloneData: (obj: object) => object;
		arrRandom: (arr: any[]) => any[];
		objRandom: (obj: any[]) => any[];
		arrErase: (arr: any[], ...args: any[]) => any[];
		arrToggle: (original: any[], toggleArr: any[]) => any[];
		objToMap: (obj: any) => Collection<any, any>;
		mapToObj: (map: Map<any, any> | Collection<any, any>) => object;
		isInstance: (obj: object, cls: any) => boolean;
	}

	export interface IFormatter {
		inline: (str: string | string[]) => string | string[];
		codeblock: (str: string | string[], lang?: string) => string | string[];
		commandHelp(cmd: any, maxWidth?: number, useCodeBlocks?: boolean): object;
	}
/*
	interface IAbstractCommand {
		subcommands?: Collection<string, ISubCommand>;
		readonly name: string;
		readonly description: string;
		readonly usage: Array<string[]>;
		registerSubCommands: (...subCmds: ISubCommand[]) => IAbstractCommand;
	}

	export interface IBaseCommand extends IAbstractCommand {
		readonly module: string;
		execute: (ctx: IContext, ...args: string[]) => void;
		noArgsFallback?: (ctx: IContext) => void;
	}
	export interface ISubCommand extends IAbstractCommand {
		readonly parent: ISubCommand | IBaseCommand;
		readonly base: IBaseCommand;
		setParent: (cmd: Command) => void | Error;
		getParent: () => Command | undefined;
		setBase: (cmd: Command) => void | Error;
		getBase: () => IBaseCommand | undefined;
		execute: (ctx: IContext, ...args: string[]) => void;
		noArgsFallback?: (ctx: IContext) => void;
	}

	type Command = ISubCommand | IBaseCommand;
*/
}
