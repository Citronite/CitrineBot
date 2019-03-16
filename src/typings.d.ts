declare module 'typings' {
	import { 
		Collection, 
		Client, 
		Message, 
		User, 
		GuildMember, 
		Guild, 
		Channel,
		Snowflake,
		MessageReaction
	} from 'discord.js';

	export type GuildID = Snowflake;
	export type ChannelID = Snowflake;
	export type RoleID = Snowflake;
	export type UserID = Snowflake;

	export type CommandOptions = {
		description? : string,
		botPerms? : string[],
		memberPerms? : string[],
		usageArgs? : Array<string[]>,
	}

	export interface IMessageContext {
		readonly client: Client;
		readonly invokedPrefix: string;
		readonly message: Message;
		readonly author: User;
		readonly channel: Channel;
		success: (msg: string, embed: boolean) => Promise<Message | Message[]>;
		error: (msg: string, type: string, embed: boolean) => Promise<Message | Message[]>;
		alert: (msg: string, embed: boolean) => Promise<Message | Message[]>;
		confirm: (msg: string, timeOut: number) => Promise<boolean | null>;
		prompt: (msg: string, contentOnly: boolean, timeOut: number) => Promise<Message | string | null>;
		promptReaction: (msg: string, emojis: string[], limit: number, timeOut: number) => Promise<MessageReaction[] | null>;
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
		reqRoles: { [cmd in string]: RoleID | undefined }
	}

	export interface IGlobalConfig {
		owner: UserID;
		prefix: string;
		devs: Set<UserID>;
		disabledUsers: Set<UserID>;
		disabledGuilds: Set<GuildID>;
		disabledCommands: Set<string>;
	}

	interface IAbstractCommand {
		subcommands?: Collection<string, ISubCommand>;
		readonly name: string;
		readonly description: string;
		readonly usageArgs: Array<string[]>;
		registerSubCommands: (...subCmds: ISubCommand[]) => IAbstractCommand;
	}

	export interface IBaseCommand extends IAbstractCommand {
		readonly module: string;
		setAlias: (alias: string) => string[];
		unsetAlias: (alias: string) => string[];
		execute: (ctx: IMessageContext, ...args: string[]) => void;
		noArgsFallback?: (ctx: IMessageContext) => void;
	}
	export interface ISubCommand extends IAbstractCommand {
		readonly parent: ISubCommand | IBaseCommand;
		readonly base: IBaseCommand;
		setParentCmd: (cmd: Command) => void | Error;
		getParentCmd: () => Command | undefined;
		setBaseCmd: (cmd: Command) => void | Error;
		getBaseCmd: () => IBaseCommand | undefined;
		execute: (ctx: IMessageContext, ...args: string[]) => void;
		noArgsFallback?: (ctx: IMessageContext) => void;
	}

	export type Command = ISubCommand | IBaseCommand;
}
