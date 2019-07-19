import { Guild } from 'discord.js';
import { GuildConfigData, RoleID, ChannelID, UserID } from 'typings';

export default class GuildConfig {
  private readonly data: GuildConfigData;

  public constructor(guild: Guild | GuildConfigData) {
    if (guild instanceof Guild) {
      const client: any = guild.client;
      this.data = {
        id: guild.id,
        prefix: client.settings.globalPrefix,
        disabledRole: '',
        deleteCmdCalls: false,
        deleteCmdCallsDelay: 5000,
        readMsgEdits: false,
        disabledUsers: [],
        disabledChannels: [],
        disabledCommands: [],
        reqRoles: {}
      };
    } else {
      this.data = {
        id: guild.id,
        prefix: guild.prefix,
        disabledRole: guild.disabledRole,
        deleteCmdCalls: guild.deleteCmdCalls,
        deleteCmdCallsDelay: guild.deleteCmdCallsDelay,
        readMsgEdits: guild.readMsgEdits,
        disabledUsers: [...new Set(guild.disabledUsers)],
        disabledChannels: [...new Set(guild.disabledChannels)],
        disabledCommands: [...new Set(guild.disabledCommands)],
        reqRoles: guild.reqRoles
      };
    }
  }

  /**
   * The ID of the guild
   */
  public get id(): string {
    return this.data.id;
  }

  /**
   * The guild-specific bot prefix.
   */
  public get prefix(): string {
    return this.data.prefix;
  }

  public set prefix(str: string) {
    this.data.prefix = str;
  }

  /**
   * The disabled role for the guild
   */
  public get disabledRole(): string {
    return this.data.disabledRole;
  }

  public set disabledRole(id: string) {
    this.data.disabledRole = id;
  }

  /**
   * Whether to delete command invocations.
   */
  public get deleteCmdCalls(): boolean {
    return this.data.deleteCmdCalls;
  }

  public set deleteCmdCalls(val: boolean) {
    this.data.deleteCmdCalls = val;
  }

  /**
   * Delay before deleting command invocations.
   * Must be between 1 to 3600 seconds.
   */
  public get deleteCmdCallsDelay(): number {
    return this.data.deleteCmdCallsDelay;
  }

  public set deleteCmdCallsDelay(val: number) {
    if (val >= 3600000 && val <= 1000) {
      this.data.deleteCmdCallsDelay = val;
    } else {
      this.data.deleteCmdCallsDelay = 5000;
    }
  }

  /**
   * Whether to listen for commands on message edits, when possible.
   */
  public get readMsgEdits(): boolean {
    return this.data.readMsgEdits;
  }

  public set readMsgEdits(val: boolean) {
    this.data.readMsgEdits = val;
  }

  /**
   * Array of user IDs disabled from using the bot.
   */
  public get disabledUsers(): UserID[] {
    return [...this.data.disabledUsers];
  }

  /**
   * Add a user id to the list of disabled users.
   */
  public disableUser(id: UserID): void {
    const tmp = new Set(this.data.disabledUsers);
    tmp.add(id);
    this.data.disabledUsers = [...tmp];
  }

  /**
   * Remove a user id from the list of disabled users.
   */
  public enableUser(id: UserID): void {
    const tmp = new Set(this.data.disabledUsers);
    tmp.delete(id);
    this.data.disabledUsers = [...tmp];
  }

  /**
   * Array of channel IDs the bot will ignore.
   */
  public get disabledChannels(): ChannelID[] {
    return [...this.data.disabledChannels];
  }

  /**
   * Add a channel ID to the list of ignored channels.
   */
  public disableChannel(id: ChannelID): void {
    const tmp = new Set(this.data.disabledChannels);
    tmp.add(id);
    this.data.disabledChannels = [...tmp];
  }

  /**
   * Remove a channel ID from the list of ignored channels.
   */
  public enableChannel(id: ChannelID): void {
    const tmp = new Set(this.data.disabledChannels);
    tmp.delete(id);
    this.data.disabledChannels = [...tmp];
  }

  /**
   * Array of disabled BaseCommand names
   */
  public get disabledCommands(): string[] {
    return [...this.data.disabledCommands];
  }

  /**
   * Add a command to the list of disabled commands
   */
  public disableCommand(id: string): void {
    const tmp = new Set(this.data.disabledCommands);
    tmp.add(id);
    this.data.disabledCommands = [...tmp];
  }

  /**
   * Remove a command from the list of disabled commands.
   */
  public enableCommand(id: string): void {
    const tmp = new Set(this.data.disabledCommands);
    tmp.delete(id);
    this.data.disabledCommands = [...tmp];
  }

  /**
   * Object containing mapping command names with the ID
   * of the role required to use that command.
   */
  public get reqRoles(): { [key: string]: string } {
    return this.data.reqRoles;
  }

  /**
   * Add a required role for a command.
   */
  public addReqRole(cmd: string, role: RoleID): void {
    this.data.reqRoles[cmd] = role;
  }

  /**
   * Remove a required role for a command.
   */
  public removeReqRole(cmd: string): void {
    delete this.data.reqRoles[cmd];
  }

  /**
   * Convert the data to JSON format.
   */
  public toJSON(): { [key: string]: any } {
    const conf = this.data;
    return {
      ...conf,
      disabledUsers: [...conf.disabledUsers],
      disabledChannels: [...conf.disabledChannels],
      disabledCommands: [...conf.disabledCommands]
    };
  }
}
