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
  } from 'discord.js';

  export interface ICmdHandler {
    checkPrefix: (message: any, config?: any) => string | null;
    getArgs: (message: any, prefix: string, parseQuotes?: boolean) => string[] | null;
    getBaseCmd: (message: any, args: string[]) => [any, string[]] | [null, null];
    getFinalCmd: (message: Message, args: string[]) => [any, string[]] | [null, null];
    processCommand: (message: any, config?: any) => Promise<void>;
  }

  export interface IPermHandler {
    checkCustomFilters: (cmd: any, message: Message | any, ) => Promise<boolean>;
    checkDiscordPerms: (perms: PermissionResolvable, member: GuildMember, channel: TextChannel, checkAdmin?: boolean) => void;
    checkGuildOwner: (guild: Guild, user: User | GuildMember) => void;
    checkBotOwner: (user: User | GuildMember) => void;
    checkBotDev: (user: User | GuildMember) => void;
  }

  export interface IDjsUtils {
    parseMention: (mention: string) => string;
    parseQuotes: (text: string) => (string | undefined)[];
    resolveRole: (guild: Guild, role: string) => Promise<Role | null>;
    resolveGuildChannel: (guild: Guild, channel: string) => Promise<GuildChannel | null>;
    resolveUser: (client: any, user: string) => Promise<User | null>;
    resolveGuildMember(guild: Guild, member: string): Promise<GuildMember | null>;
  }

  export interface IFormatter {
    inline: (str: string | string[]) => string | string[];
    block: (str: string | string[], lang?: string) => string | string[];
    cmdHelp(cmd: any, options: any): object;
  }

  export interface IGlobalConfig {
    owner: UserID;
    globalPrefix: string;
    verbose: boolean;
    devs: Set<UserID>;
    disabledUsers: Set<UserID>;
    disabledGuilds: Set<GuildID>;
    disabledCommands: Set<string>;
    loadedModules: Set<string>;
    aliases: { [cmd in string]: string[] };
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
    author?: UserID
  }
  export type CommandOptions = {
    name: string,
    description: string,
    usage?: string
  }
  export type FormatHelpOptions = {
    maxWidth?: number,
    useCodeBlocks?: boolean
  }
}
