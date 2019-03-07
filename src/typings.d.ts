declare module 'typings' {
	import { 
		Collection, 
		Client, 
		Message, 
		User, 
		GuildMember, 
		Guild, 
		Channel,
		Snowflake
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

	export interface IContext {
		readonly client: Client;
		readonly invokedPrefix: string;
		readonly message: Message;
		readonly author: User;
		readonly channel: Channel;
	}

	export interface IGuildConfig {
		readonly id: string;
		prefix: string;
		disabledChannels: ChannelID[];
		disabledRole: RoleID;
		deleteCmdCalls: boolean;
		deleteCmdCallsDelay: number;
		reqRoles: { [cmd in string]: RoleID }
	}

	export interface ICitrineClient {

	}

	interface IAbstractCommand {
		subcommands : Collection<string, ISubCommand>;
		readonly name: string;
		readonly description: string;
		readonly botPerms: string[];
		readonly memberPerms: string[];
		readonly usageArgs: Array<string[]>;
		registerSubCommands: (...subCmds: ISubCommand[]) => IAbstractCommand;
	}

	export interface IBaseCommand extends IAbstractCommand {
		readonly module: string;
		disabled: boolean;
		disabledIn: ChannelID[];
		aliases: string[];
		globalEnable: () => void;
		globalDisable: () => void;
		disableIn: (id: ChannelID | GuildID, guild: Guild) => string[];
		enableIn: (id: ChannelID | GuildID, guild: Guild) => string[];
		setAlias: (alias: string) => string[];
		unsetAlias: (alias: string) => string[];
		execute: (ctx: IContext, ...args: string[]) => void;
		noArgsFallback?: (ctx: IContext) => void;
	}
	export interface ISubCommand extends IAbstractCommand {
		readonly parent: ISubCommand | IBaseCommand;
		readonly base: IBaseCommand;
		setParentCmd: (cmd: Command) => void | Error;
		getParentCmd: () => Command | undefined;
		setBaseCmd: (cmd: Command) => void | Error;
		getBaseCmd: () => IBaseCommand | undefined;
		execute: (ctx: IContext, ...args: string[]) => void;
		noArgsFallback?: (ctx: IContext) => void;
	}

	export type Command = ISubCommand | IBaseCommand;
}
