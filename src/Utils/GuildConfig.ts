import { Guild } from 'discord.js';
import {
  GuildID,
  ChannelID,
  RoleID,
  UserID
} from 'typings';

const props = [
  'id',
  'prefix',
  'disabledRole',
  'deleteCmdCalls',
  'deleteCmdCallsDelay',
  'readMsgEdits',
  'disabledUsers',
  'disabledChannels',
  'disabledCommands',
  'reqRoles'
];

export class GuildConfig {
  public readonly id: GuildID;
  private readonly data: any;

  constructor(guild: Guild | GuildConfig) {
    if (guild instanceof Guild) {
      // Have to use any here since TS doesn't know guild.client
      // would be CitrineClient instead of Client.
      const client: any = guild.client;
      this.id = guild.id;
      this.data = {
        id: guild.id,
        prefix: client.settings.globalPrefix,
        disabledRole: '',
        deleteCmdCalls: false,
        deleteCmdCallsDelay: 2000,
        readMsgEdits: false,
        disabledUsers: new Set(),
        disabledChannels: new Set(),
        disabledCommands: new Set(),
        reqRoles: {},
      };

    }	else {

      Object.keys(guild).forEach(val => {
        if (!props.includes(val)) throw new Error('Invalid data provided to GuildConfig constructor!');
      });

      this.id = guild.id;
      this.data = {
        id: guild.id,
        prefix: guild.prefix,
        disabledRole: guild.disabledRole,
        deleteCmdCalls: guild.deleteCmdCalls,
        deleteCmdCallsDelay: guild.deleteCmdCallsDelay,
        readMsgEdits: guild.readMsgEdits,
        disabledUsers: new Set(guild.disabledUsers),
        disabledChannels: new Set(guild.disabledChannels),
        disabledCommands: new Set(guild.disabledCommands),
        reqRoles: guild.reqRoles,
      };

    }
  }

  get prefix(): string {
    return this.data.prefix;
  }

  set prefix(str: string) {
    this.data.prefix = str;
  }

  get disabledRole(): string {
    return this.data.disabledRole;
  }

  set disabledRole(id: string) {
    this.data.disabledRole = id;
  }

  get deleteCmdCalls(): boolean {
    return this.data.deleteCmdCalls;
  }

  set deleteCmdCalls(val: boolean) {
    this.data.deleteCmdCalls = val;
  }

  get deleteCmdCallsDelay(): number {
    return this.data.deleteCmdCallsDelay;
  }

  set deleteCmdCallsDelay(val: number) {
    if (val >= 3600000 && val <= 1000) {
      this.data.deleteCmdCallsDelay = val;
    } else {
      this.data.deleteCmdCallsDelay = 5000;
    }
  }

  get readMsgEdits(): boolean {
    return this.data.readMsgEdits;
  }

  set readMsgEdits(val: boolean) {
    this.data.readMsgEdits = val;
  }

  get disabledUsers(): UserID[] {
    return [...this.data.disabledUsers];
  }

  public disableUser(id: UserID): void {
    this.data.disabledUsers.add(id);
  }

  public enableUser(id: UserID): void {
    this.data.disabledUsers.delete(id);
  }

  get disabledChannels(): ChannelID[] {
    return [...this.data.disabledChannels];
  }

  public disableChannel(id: ChannelID): void {
    this.data.disabledChannels.add(id);
  }

  public enableChannel(id: ChannelID): void {
    this.data.disabledChannels.delete(id);
  }

  get disabledCommands(): string[] {
    return [...this.data.disabledCommands];
  }

  public disableCommand(id: string): void {
    this.data.disabledCommands.add(id);
  }

  public enableCommand(id: string): void {
    this.data.disabledCommands.delete(id);
  }

  get reqRoles(): object {
    return this.data.reqRoles;
  }

  public setReqRole(cmd: string, role: RoleID): void {
    this.data.reqRoles[cmd] = role;
  }

  public unsetReqRole(cmd: string): void {
    this.data.reqRoles[cmd] = undefined;
  }

  public toJSON(): object {
    const conf = this.data;
    return {
      ...conf,
      disabledUsers: [...conf.disabledUsers],
      disabledChannels: [...conf.disabledChannels],
      disabledCommands: [...conf.disabledCommands],
    };
  }

  public toString(): string {
    const obj = this.toJSON();
    return JSON.stringify(obj, null, '\n\t');
  }
}
