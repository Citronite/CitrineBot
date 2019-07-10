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
    DMChannel,
    GroupDMChannel,
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

  // Had to add the 'any's because TypeScript doesn't allow access modifiers
  // in interfaces, and then complains if access modifiers are different between
  // interfaces and implementations :(

  interface CitrineSettings {
    data: GlobalConfigData;
    client: CitrineClient;
    owner: string;
    globalPrefix: string;
    verbose: boolean;
    devs: UserID[];
    addDev: (id: UserID) => void;
    removeDev: (id: UserID) => void;
    disabledUsers: UserID[];
    disableUser: (id: UserID) => void;
    enableUser: (id: UserID) => void;
    disabledGuilds: GuildID[];
    disableGuild: (id: GuildID) => void;
    enableGuild: (id: GuildID) => void;
    disabledCommands: string[];
    disableCommand: (cmd: string) => void;
    enableCommand: (cmd: string) => void;
    loadedChips: string[];
    addLoadedChip: (chip: string) => void;
    removeLoadedChip: (chip: string) => void;
    aliases: { [key: string]: string };
    addAlias: (cmd: string, alias: string) => void;
    removeAlias: (cmd: string, alias: string) => void;
    save: () => Promise<void>;
    load: () => Promise<void>;
    toJSON: () => { [key: string]: any };
  }

  interface CitrineClient extends Client {
    settings: CitrineSettings;
    logger: Logger;
    utils: Utils;
    db: DbDriver;
    cmdHandler: CmdHandler;
    permHandler: PermHandler;
    commands: Collection<string, BaseCommand>;
    defaultChips: Set<string>;
    lastException: Error | null;
    initChips: () => void;
    initEvents: () => void;
    loadChip: (chip: string) => Promise<void>;
    unloadChip: (chip: string) => Promise<void>;
    clearChipCache: (chip: string) => Promise<void>;
    launch: () => Promise<void>;
  }

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

  interface GuildConfig {
    data: GuildConfigData;
    id: string;
    prefix: string;
    disabledRole: string;
    deleteCmdCalls: boolean;
    deleteCmdCallsDelay: number;
    readMsgEdits: boolean;
    disabledUsers: UserID[];
    disableUser: (id: UserID) => void;
    enableUser: (id: UserID) => void;
    disabledChannels: ChannelID[];
    disableChannel: (id: ChannelID) => void;
    enableChannel: (id: ChannelID) => void;
    disabledCommands: string[];
    disableCommand: (name: string) => void;
    enableCommand: (name: string) => void;
    reqRoles: { [key: string]: string };
    addReqRole: (cmd: string, role: RoleID) => void;
    removeReqRole: (cmd: string) => void;
    toJSON: () => { [key: string]: any };
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

  interface CmdHandler {
    checkPrefix: (message: Message, config?: GuildConfig & any) => string | null;
    getArgs: (message: Message, prefix: string, parseQuotes?: boolean) => string[] | null;
    getBaseCmd: (message: Message, args: string[]) => [BaseCommand, string[]] | null;
    getFinalCmd: (message: Message, args: string[]) => [Command, string[]] | null;
    getCmdGenerator: (
      message: Message,
      args: string[]
    ) => IterableIterator<[Command, string[]] | undefined>;
    processCommand: (message: Message, config?: GuildConfig & any) => Promise<void>;
  }

  interface PermHandler {
    checkFilters: (ctx: Context & any, config?: GuildConfig & any) => void;
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

  interface DjsUtils {
    extractCodeBlock: (text: string) => void | CodeBlockData;
    parseMention: (mention: string) => string;
    parseQuotes: (text: string) => (string | undefined)[];
    resolveRole: (guild: Guild, role: string) => Promise<Role | null>;
    resolveGuildChannel: (guild: Guild, channel: string) => Promise<GuildChannel | null>;
    resolveUser: (client: Client, user: string) => Promise<User | null>;
    resolveGuildMember(guild: Guild, member: string): Promise<GuildMember | null>;
  }

  interface Formatter {
    censor: (text: string, ...words: string[]) => string;
    italic: (str: string | string[]) => string | string[];
    lined: (str: string | string[]) => string | string[];
    striked: (str: string | string[]) => string | string[];
    bold: (str: string | string[]) => string | string[];
    inline: (str: string | string[]) => string | string[];
    block: (str: string | string[], lang?: string) => string | string[];
    cmdHelp(cmd: Command, options?: FormatHelpOptions): CommandHelpData;
  }

  interface Utils {
    djs: DjsUtils;
    format: Formatter;
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

  export interface DbDriver {
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

  type LoggerType = 'Console' | 'Winston';
  type DbDriverType = 'Memory' | /*'Json' |*/ 'SQLiteKV';

  export interface CitrineOptions extends ClientOptions {
    defaultChips?: string[];
    logger?: LoggerType;
    dbDriver?: DbDriverType;
  }

  export type Command = BaseCommand | SubCommand;

  export type Reaction = string | Emoji | ReactionEmoji;

  export type GuildID = Snowflake;
  export type ChannelID = Snowflake;
  export type RoleID = Snowflake;
  export type UserID = Snowflake;

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

// export type RawExceptionObject = { type: string | number, msg: string | string[] };
