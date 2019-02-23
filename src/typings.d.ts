
declare module 'typings' {
	import { 
		Collection, 
		Client, 
		Message, 
		User, 
		GuildMember, 
		Guild, 
		TextChannel,
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

	export interface ICommand {
		readonly name: string;
		execute: (ctx: IContext, ...args: string[]) => void;
		noArgsFallback?: (ctx: IContext) => void;
	}

	export interface IContext {
		readonly client: Client;
		readonly invokedPrefix: string;
		readonly message: Message;
		readonly author: User;
		readonly channel: TextChannel;
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
}