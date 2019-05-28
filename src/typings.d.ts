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

  export interface CmdHandler {
    checkPrefix: (message: any, config?: any) => string | null;
    getArgs: (message: any, prefix: string, parseQuotes?: boolean) => string[] | null;
    getBaseCmd: (message: any, args: string[]) => [any, string[]] | [null, null];
    getFinalCmd: (message: Message, args: string[]) => [any, string[]] | [null, null];
    processCommand: (message: any, config?: any) => Promise<void>;
  }

  export interface PermHandler {
    checkCustomFilters: (cmd: any, message: Message | any, ) => Promise<boolean>;
    checkDiscordPerms: (perms: PermissionResolvable, member: GuildMember, channel: TextChannel, checkAdmin?: boolean) => void;
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
    connect: (name: string, ...options: any[]) => DbConnection;
    disconnect: (...args: any[]) => any;
  }

  export interface DbConnection {
    get: (...args: any[]) => any;
    set: (...args: any[]) => any;
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
    cmdHandler?: CmdHandler;
    permHandler?: PermHandler;
    utils?: Utils;
    logger?: Logger;
    dbProvider?: DbProvider;
  }

  export type GuildID = Snowflake;
  export type ChannelID = Snowflake;
  export type RoleID = Snowflake;
  export type UserID = Snowflake;
  export type Reaction = string | Emoji | ReactionEmoji;
  export type LockType = 'dm' | 'guild' | 'botOwner' | 'botDev' | boolean;
  export type LockPermsOptions = {
    checkAdmin?: boolean,
    checkBot?: boolean
  }
  export type PromptOptions = {
    contentOnly?: boolean,
    timeOut?: number,
    author?: UserID,
    filter?: (...args: any[]) => any;
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
}
