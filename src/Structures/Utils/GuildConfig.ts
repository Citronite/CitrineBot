import { Guild } from 'discord.js';
import { ChannelID, RoleID, UserID, GuildConfigData } from 'typings';

export default class GuildConfig {
  private readonly data: GuildConfigData;

  public constructor(guild: Guild | GuildConfig) {
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

  public get id(): string {
    return this.data.id;
  }

  public set id(v: string) {
    return;
  }

  public get prefix(): string {
    return this.data.prefix;
  }

  public set prefix(str: string) {
    this.data.prefix = str;
  }

  public get disabledRole(): string {
    return this.data.disabledRole;
  }

  public set disabledRole(id: string) {
    this.data.disabledRole = id;
  }

  public get deleteCmdCalls(): boolean {
    return this.data.deleteCmdCalls;
  }

  public set deleteCmdCalls(val: boolean) {
    this.data.deleteCmdCalls = val;
  }

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

  public get readMsgEdits(): boolean {
    return this.data.readMsgEdits;
  }

  public set readMsgEdits(val: boolean) {
    this.data.readMsgEdits = val;
  }

  public get disabledUsers(): UserID[] {
    return [...this.data.disabledUsers];
  }

  public disableUser(id: UserID): void {
    const tmp = new Set(this.data.disabledUsers);
    tmp.add(id);
    this.data.disabledUsers = [...tmp];
  }

  public enableUser(id: UserID): void {
    const tmp = new Set(this.data.disabledUsers);
    tmp.delete(id);
    this.data.disabledUsers = [...tmp];
  }

  public get disabledChannels(): ChannelID[] {
    return [...this.data.disabledChannels];
  }

  public disableChannel(id: ChannelID): void {
    const tmp = new Set(this.data.disabledChannels);
    tmp.add(id);
    this.data.disabledChannels = [...tmp];
  }

  public enableChannel(id: ChannelID): void {
    const tmp = new Set(this.data.disabledChannels);
    tmp.delete(id);
    this.data.disabledChannels = [...tmp];
  }

  public get disabledCommands(): string[] {
    return [...this.data.disabledCommands];
  }

  public disableCommand(id: string): void {
    const tmp = new Set(this.data.disabledCommands);
    tmp.add(id);
    this.data.disabledCommands = [...tmp];
  }

  public enableCommand(id: string): void {
    const tmp = new Set(this.data.disabledCommands);
    tmp.delete(id);
    this.data.disabledCommands = [...tmp];
  }

  public get reqRoles(): { [key: string]: string } {
    return this.data.reqRoles;
  }

  public addReqRole(cmd: string, role: RoleID): void {
    this.data.reqRoles[cmd] = role;
  }

  public removeReqRole(cmd: string): void {
    delete this.data.reqRoles[cmd];
  }

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
