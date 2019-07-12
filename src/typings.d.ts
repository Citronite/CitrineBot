declare module "typings" {
  import {
    Collection,
    Client,
    Message,
    User,
    GuildMember,
    Guild,
    TextChannel,
    DMChannel,
    GroupDMChannel,
    Snowflake,
    MessageReaction,
    PermissionResolvable,
    Emoji,
    ReactionEmoji,
    ClientOptions
  } from 'discord.js';

  interface Context {
    client: Client;
    prefix: string;
    message: Message;
    author: User;
    member: GuildMember | null;
    channel: TextChannel | DMChannel | GroupDMChannel;
    guild: Guild | null;
    command: Command;
    subcommand?: SubCommand;
    send: (...args: any[]) => Promise<Message | Message[]>;
    sendDM: (...args: any[]) => Promise<Message | Message[]>;
    success: (msg: string, embed: boolean) => Promise<Message | Message[]>;
    error: (msg: string, embed: boolean) => Promise<Message | Message[]>;
    prompt: () => Promise<Message | string | null>;
    promptReaction: () => Promise<MessageReaction | null>;
    lockPerms: (perms: PermissionResolvable, options?: LockPermsOptions) => void;
    lock: (...locks: LockType[]) => void;
  }

  interface BaseCommand {
    name: string;
    description: string;
    usage?: string;
    chip: string;
    subcommands?: Collection<string, SubCommand>;
    execute: (ctx: Context & any, ...args: string[]) => Promise<void>;
    register: (...args: SubCommand[]) => this;
  }

  interface SubCommand {
    name: string;
    description: string;
    usage?: string;
    parent?: Command;
    subcommands?: Collection<string, SubCommand>;
    execute: (ctx: Context & any, ...args: string[]) => Promise<void>;
    getParent: () => Command | undefined;
    getBase: () => BaseCommand | undefined;
    register: (...args: SubCommand[]) => this;
  } 

  export interface Logger {
    info: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn: (...args: any[]) => void;
  }

  export interface DbConnection {
    create: (...args: any[]) => Promise<void>;
    read: (...args: any[]) => Promise<any>;
    update: (...args: any[]) => Promise<void>;
    delete: (...args: any[]) => Promise<void>;
    drop: () => Promise<void>;
  }

  export interface DbProvider {
    connect: (...options: any[]) => DbConnection;
    disconnect: (...args: any[]) => void;
  }

  export interface GlobalConfigData {
    owner: UserID;
    globalPrefix: string;
    verbose: boolean;
    devs: UserID[];
    disabledUsers: UserID[];
    disabledGuilds: GuildID[];
    disabledCommands: string[];
    loadedChips: string[];
    aliases: { [cmd: string]: string[] };
  }

  export interface GuildConfigData {
    id: string;
    prefix: string;
    disabledRole: string;
    deleteCmdCalls: boolean;
    deleteCmdCallsDelay: number;
    readMsgEdits: boolean;
    disabledUsers: UserID[];
    disabledChannels: ChannelID[];
    disabledCommands: string[];
    reqRoles: { [key: string]: string };
  }

  export type LoggerType = 'Console' | 'Winston';
  export type DbProviderType = 'Memory' | /*'Json' |*/ 'SQLiteKV';

  export interface CitrineOptions extends ClientOptions {
    defaultChips?: string[];
    logger?: LoggerType;
    DbProvider?: DbProviderType;
  }

  export type Command = BaseCommand | SubCommand;

  export type Reaction = string | Emoji | ReactionEmoji;

  export type GuildID = Snowflake;
  export type ChannelID = Snowflake;
  export type RoleID = Snowflake;
  export type UserID = Snowflake;

  // export type RawExceptionObject = { type: string | number, msg: string | string[] };
  export type RawExceptionArray = [string | number, string | string[]];
  export type RawException = string | number | RawExceptionArray | Error;

  export type LockType =
    | 'nsfw'
    | 'dm'
    | 'guild'
    | 'guildOwner'
    | 'botOwner'
    | 'botManager'
    | 'botDev'
    | boolean;

  export type LockPermsOptions = {
    checkAdmin?: boolean;
    checkBot?: boolean;
  };

  export type PromptOptions = {
    contentOnly?: boolean;
    timeOut?: number;
    filter?: (...args: any[]) => any;
  };

  export type PromptReactionOptions = {
    limit?: number;
    timeOut?: number;
    filter?: (...args: any[]) => any; // TODO: Add proper typings here.
  };

  export type SubCommandOptions = {
    name: string;
    description: string;
    usage?: string;
  };

  export type BaseCommandOptions = {
    name: string;
    description: string;
    usage?: string;
    chip: string;
  };

  export type FormatHelpOptions = {
    maxWidth?: number;
    useCodeBlocks?: boolean;
  };

  export type ContextData = {
    message: Message;
    prefix: string;
    command: Command;
    subcommand?: SubCommand;
    args?: string[]; // TODO: Implement this in Context class and allow flags for commands
  };

  export type CommandHelpData = {
    name: string;
    description: string;
    chip: string;
    parent: string;
    base: string;
    usage?: string;
    subcommands?: string;
  };

  export type CodeBlockData = {
    match: string;
    lang: string;
    code: string;
    input: string;
  };
}