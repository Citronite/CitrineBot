
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

  export interface IGlobalConfig {
    owner: UserID;
    globalPrefix: string;
    devs: Set<UserID>;
    disabledUsers: Set<UserID>;
    disabledGuilds: Set<GuildID>;
    disabledCommands: Set<string>;
    loadedModules: Set<string>;
    aliases: { [cmd in string]: string[] };
  }

  export interface ICmdHandler {
    checkPrefix: (message: any, config: any) => string | null;
    getArgs: (message: any, prefix: string, parseQuotes: boolean) => string[] | null;
    getBaseCmd: (message: any, args: string[]) => [any, string[]] | [null, null];
    getFinalCmd: (message: Message, args: string[]) => [any, string[]] | [null, null];
    processCommand: (message: any, config: any) => Promise<void>;
  }

  export interface IPermHandler {
    checkCustomFilters: (cmd: any, message: Message, client: any) => Promise<boolean>;
    checkDiscordPerms: (channel: TextChannel, member: GuildMember, perms: PermissionResolvable, checkAdmin?: boolean) => void;
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
    resolveRole: (guild: Guild, role: string) => Promise<Role | null>;
    resolveGuildChannel: (guild: Guild, channel: string) => Promise<GuildChannel | null>;
    resolveUser: (client: any, user: string) => Promise<User | null>;
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

  interface IAbstractCommand {
    subcommands?: Collection<string, ISubCommand>;
    readonly name: string;
    readonly description: string;
    readonly usage: string;
    registerSubCommands: (...subCmds: ISubCommand[]) => IAbstractCommand;
  }

  interface IBaseCommand extends IAbstractCommand {
    readonly chip: string;
  }
  interface ISubCommand extends IAbstractCommand {
    readonly parent: ISubCommand | IBaseCommand;
    readonly base: IBaseCommand;
    setParent: (cmd: Command) => void | Error;
    getParent: () => Command | undefined;
    setBase: (cmd: Command) => void | Error;
    getBase: () => IBaseCommand | undefined;
  }

  export type Command = ISubCommand | IBaseCommand;

}
