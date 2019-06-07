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
    GuildChannel,
    Emoji,
    ReactionEmoji,
    ClientOptions
  } from 'discord.js';

  /*
  interface CitrineClient {
    loadChip: (chip: string) => Promise<void>;
    unloadChip: (chip: string) => Promise<void>;
    launch: () => Promise<void>;
    initEvents: () => void;
    initChips: () => void;
    permHandler: IPermHandler;
    cmdHandler: ICmdHandler;
    utils: Utils;
    commands: Collection<string, Command>;
    logger: Logger;
    lastException: any;
    defaultChips: Set<string>;
    db: DbProvider;
    settings: 
  }
  */

  interface Command {
    name: string;
    description: string;
    usage?: string;
    execute: (...args: any[]) => Promise<void>;
    registerSubCommands: (...args: Command[]) => this;
  }

  interface BaseCommand extends Command {
    chip: string;
  }

  interface SubCommand extends Command {
    setParent: (cmd: Command) => void;
    getParent: () => Command | null;
    setBase: (cmd: BaseCommand) => void;
    getBase: () => BaseCommand | null;
  }

  export interface ICmdHandler {
    checkPrefix: (message: any, config?: any) => string | null;
    getArgs: (message: any, prefix: string, parseQuotes?: boolean) => string[] | null;
    getBaseCmd: (message: any, args: string[]) => [Command, string[]] | null;
    getFinalCmd: (message: Message, args: string[]) => [Command, string[]] | null;
    processCommand: (message: any, config?: any) => Promise<void>;
  }

  export interface IPermHandler {
    checkFilters: (ctx: any, config: any) => void;
    checkPerms: (perms: PermissionResolvable, member: GuildMember, channel: TextChannel, checkAdmin?: boolean) => void;
    checkGuildOwner: (guild: Guild, user: User | GuildMember) => void;
    checkBotOwner: (user: User | GuildMember) => void;
    checkBotDev: (user: User | GuildMember) => void;
  }

  export interface DjsUtils {
    parseMention: (mention: string) => string;
    parseQuotes: (text: string) => (string | undefined)[];
    resolveRole: (guild: Guild, role: string) => Promise<Role | null>;
    resolveGuildChannel: (guild: Guild, channel: string) => Promise<GuildChannel | null>;
    resolveUser: (client: any, user: string) => Promise<User | null>;
    resolveGuildMember(guild: Guild, member: string): Promise<GuildMember | null>;
  }

  export interface Formatter {
    inline: (str: string | string[]) => string | string[];
    block: (str: string | string[], lang?: string) => string | string[];
    cmdHelp(cmd: any, options: any): object;
  }

  export interface Utils {
    djs: DjsUtils;
    format: Formatter;
  }
  
  export interface Logger {
    info: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn: (...args: any[]) => void;
  }

  export interface DbProvider {
    connect: (...options: any[]) => DbConnection;
    disconnect: (...args: any[]) => any;
  }

  export interface DbConnection {
    create: (...args: any[]) => any;
    read: (...args: any[]) => any;
    update: (...args: any[]) => any;
    delete: (...args: any[]) => any;
  }

  export interface GlobalConfig {
    owner: UserID;
    globalPrefix: string;
    verbose: boolean;
    devs: Set<UserID>;
    disabledUsers: Set<UserID>;
    disabledGuilds: Set<GuildID>;
    disabledCommands: Set<string>;
    loadedChips: Set<string>;
    aliases: { [cmd: string]: string[] };
  }

  export interface GuildConfig {
    //TODO
  }

  /*
    cmdHandler, permHandler, utils must *extend* the current ones.
    The others (logger, db) must expose the same API as the current ones.
  */
  export interface CitrineOptions extends ClientOptions {
    defaultChips?: string[];
    utils?: new () => Utils;
    logger?: new () => Logger;
    dbProvider?: new () => DbProvider;
    cmdHandler?: new () => ICmdHandler;
    permHandler?: new () => IPermHandler;
  }

  export type GuildID = Snowflake;
  export type ChannelID = Snowflake;
  export type RoleID = Snowflake;
  export type UserID = Snowflake;
  export type Reaction = string | Emoji | ReactionEmoji;
  export type RawExceptionArray = [string | number, string | string[]];
  // export type RawExceptionObject = { type: string | number, msg: string | string[] };
  export type RawException = string | number | RawExceptionArray | /* RawExceptionObject | */ Error;
  export type LockType = 'nsfw' | 'dm' | 'guild' | 'botOwner' | 'botManager' | 'botDev' | boolean;
  
  export type LockPermsOptions = {
    checkAdmin?: boolean,
    checkBot?: boolean
  }

  export type PromptOptions = {
    contentOnly?: boolean,
    timeOut?: number,
    filter?: (...args: any[]) => any;
  }

  export type PromptReactionOptions = {
    limit?: number,
    timeOut?: number,
    filter?: (...args: any[]) => any; // TODO: Add proper typings here.
  }

  export type CommandOptions = {
    name: string,
    description: string,
    usage?: string,
    chip?: string;
  }

  export type FormatHelpOptions = {
    maxWidth?: number,
    useCodeBlocks?: boolean
  }

  export type ContextData = {
    message: Message,
    prefix: string,
    command: Command,
    subcommand?: SubCommand
  }
}
