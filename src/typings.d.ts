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
        db: DbDriver;
        settings: 
  }
  */

  interface ICommand {
    name: string;
    description: string;
    usage?: string;
    execute: (...args: any[]) => Promise<void>;
    registerSubCommands: (...args: ICommand[]) => this;
  }

  interface IBaseCommand extends ICommand {
    chip: string;
  }

  interface ISubCommand extends ICommand {
    setParent: (cmd: ICommand) => void;
    getParent: () => ICommand | null;
    setBase: (cmd: IBaseCommand) => void;
    getBase: () => IBaseCommand | null;
  }

  export interface ICmdHandler {
    checkPrefix: (message: Message & any, config?: any) => string | null;
    getArgs: (
      message: Message & any,
      prefix: string,
      parseQuotes?: boolean
    ) => string[] | null;
    getBaseCmd: (
      message: Message & any,
      args: string[]
    ) => [ICommand, string[]] | null;
    getFinalCmd: (
      message: Message,
      args: string[]
    ) => [ICommand, string[]] | null;
    processCommand: (message: Message & any, config?: any) => Promise<void>;
  }

  export interface IPermHandler {
    checkFilters: (ctx: any, config: any) => void;
    checkPerms: (
      perms: PermissionResolvable,
      member: GuildMember,
      channel: TextChannel,
      checkAdmin?: boolean
    ) => void;
    checkGuildOwner: (guild: Guild, user: User | GuildMember) => void;
    checkBotOwner: (user: User | GuildMember) => void;
    checkBotDev: (user: User | GuildMember) => void;
  }

  export interface IDjsUtils {
    parseMention: (mention: string) => string;
    parseQuotes: (text: string) => (string | undefined)[];
    resolveRole: (guild: Guild, role: string) => Promise<Role | null>;
    resolveGuildChannel: (
      guild: Guild,
      channel: string
    ) => Promise<GuildChannel | null>;
    resolveUser: (client: any, user: string) => Promise<User | null>;
    resolveGuildMember(
      guild: Guild,
      member: string
    ): Promise<GuildMember | null>;
  }

  export interface IFormatter {
    italic: (str: string | string[]) => string | string[];
    lined: (str: string | string[]) => string | string[];
    striked: (str: string | string[]) => string | string[];
    bold: (str: string | string[]) => string | string[];
    inline: (str: string | string[]) => string | string[];
    block: (str: string | string[], lang?: string) => string | string[];
    cmdHelp(cmd: ICommand, options: FormatHelpOptions): object;
  }

  export interface IUtils {
    djs: IDjsUtils;
    format: IFormatter;
  }

  export interface ILogger {
    info: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn: (...args: any[]) => void;
  }

  export interface IDbConnection {
    create: (...args: any[]) => Promise<void>;
    read: (...args: any[]) => Promise<any>;
    update: (...args: any[]) => Promise<void>;
    delete: (...args: any[]) => Promise<void>;
  }

  export interface IDbDriver {
    connect: (...options: any[]) => IDbConnection;
    disconnect: (...args: any[]) => void;
  }

  export interface IGlobalConfig {
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

  export interface IGuildConfig {
    id: string;
    prefix: string;
    disabledRole: string;
    deleteCmdCalls: boolean;
    deleteCmdCallsDelay: number;
    readMsgEdits: boolean;
    disabledUsers: Set<UserID>;
    disabledChannels: Set<ChannelID>;
    disabledCommands: Set<string>;
    reqRoles: { [key: string]: string } & any;
  }

  export interface ICitrineOptions extends ClientOptions {
    defaultChips?: string[];
    utils?: new () => IUtils;
    logger?: new () => ILogger;
    dbDriver?: new () => IDbDriver;
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
  export type RawException =
    | string
    | number
    | RawExceptionArray
    | /* RawExceptionObject | */ Error;
  export type LockType =
    | 'nsfw'
    | 'dm'
    | 'guild'
    | 'botOwner'
    | 'botManager'
    | 'botDev'
    | boolean; // TODO: Add nsfw check
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

  export type CommandOptions = {
    name: string;
    description: string;
    usage?: string;
    chip?: string;
  };

  export type FormatHelpOptions = {
    maxWidth?: number;
    useCodeBlocks?: boolean;
  };

  export type ContextData = {
    message: Message;
    prefix: string;
    command: ICommand;
    subcommand?: ISubCommand;
    args?: string[]; // TODO: Add this to Context class and allow flags for commands
  };
}
