import { CitrineClient } from '../CitrineClient';
import { GlobalConfig } from 'typings';

export class CitrineSettings {
  public readonly client: CitrineClient;
  private data: GlobalConfig;

  constructor(client: CitrineClient) {
    this.client = client;
    this.data = {
      owner: 'DEFAULT',
      globalPrefix: 'DEFAULT',
      verbose: true,
      devs: new Set(),
      disabledUsers: new Set(),
      disabledGuilds: new Set(),
      disabledCommands: new Set(),
      loadedChips: new Set(),
      aliases: {}
    };
  }

  get owner(): string {
    return this.data.owner;
  }

  set owner(id: string) {
    this.data.owner = id;
  }

  get globalPrefix(): string {
    return this.data.globalPrefix;
  }

  set globalPrefix(str: string) {
    this.data.globalPrefix = str;
  }

  get verbose(): boolean {
    return this.data.verbose;
  }

  set verbose(val: boolean) {
    this.data.verbose = val;
  }

  get devs(): string[] {
    return [...this.data.devs];
  }

  public addDev(id: string): void {
    this.data.devs.add(id);
  }

  public removeDev(id: string): void {
    this.data.devs.delete(id);
  }

  get disabledUsers(): string[] {
    return [...this.data.disabledUsers];
  }

  public disableUser(id: string): void {
    this.data.disabledUsers.add(id);
  }

  public enableUser(id: string): void {
    this.data.disabledUsers.delete(id);
  }

  get disabledGuilds(): string[] {
    return [...this.data.disabledGuilds];
  }

  public disableGuild(id: string): void {
    this.data.disabledGuilds.add(id);
    const guild = this.client.guilds.get(id);
    if (guild) guild.leave();
  }

  public enableGuild(id: string): void {
    this.data.disabledGuilds.delete(id);
  }

  get disabledCommands(): string[] {
    return [...this.data.disabledCommands];
  }

  public disableCommand(name: string): void {
    this.data.disabledCommands.add(name);
  }

  public enableCommand(name: string): void {
    this.data.disabledCommands.delete(name);
  }

  get loadedChips(): string[] {
    return [...this.data.loadedChips];
  }

  public addLoadedChip(name: string): void {
    this.data.loadedChips.add(name);
  }

  public removeLoadedChip(name: string): void {
    this.data.loadedChips.delete(name);
  }

  get aliases(): object {
    return this.data.aliases;
  }

  public setAlias(cmd: string, alias: string): void {
    const aliases = this.data.aliases[cmd] ? new Set(this.data.aliases[cmd]) : new Set();
    aliases.add(alias);
    this.data.aliases[cmd] = [...aliases];
  }

  public unsetAlias(cmd: string, alias: string): void {
    if (!this.data.aliases[cmd]) return;
    const aliases = new Set(this.data.aliases[cmd]);
    aliases.delete(alias);
    this.data.aliases[cmd] = [...aliases];
  }

  public async save(): Promise<void> {
    try {
      const jsonData = this.toJSON();
      await this.client.db.guilds.update('GLOBAL', jsonData);
    }	catch (err) {
      return Promise.reject(err);
    }
  }

  public async load(): Promise<void> {
    try {
      const jsonData = await this.client.db.guilds.read('GLOBAL');
      if (!jsonData) return;
      const parsed = this.fromJSON(jsonData);
      this.data = parsed;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  private fromJSON(conf: any): GlobalConfig {
    return {
      owner: conf.owner,
      globalPrefix: conf.globalPrefix,
      verbose: conf.verbose,
      devs: new Set(conf.devs),
      disabledGuilds: new Set(conf.disabledGuilds),
      disabledCommands: new Set(conf.disabledCommands),
      disabledUsers: new Set(conf.disabledUsers),
      loadedChips: new Set(conf.loadedChips),
      aliases: conf.aliases
    };
  }

  public toJSON(): object {
    const conf = this.data;
    return {
      ...conf,
      devs: [...conf.devs],
      disabledUsers: [...conf.disabledUsers],
      disabledGuilds: [...conf.disabledGuilds],
      disabledCommands: [...conf.disabledCommands],
      loadedChips: [...conf.loadedChips]
    };
  }
}