import { CitrineClient } from '../CitrineClient';
import { IGlobalConfig } from 'typings';

export class CitrineSettings {
  public readonly client: CitrineClient;
  private data: IGlobalConfig;

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
      loadedModules: new Set(),
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

  set globalPrefix(str) {
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

  get loadedModules(): string[] {
    return [...this.data.loadedModules];
  }

  public addLoadedModule(name: string): void {
    this.data.loadedModules.add(name);
  }

  public removeLoadedModule(name: string): void {
    this.data.loadedModules.delete(name);
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
      await this.client.db.guilds.set('GLOBAL', jsonData);
    }	catch (err) {
      return Promise.reject(err);
    }
  }

  public async load(): Promise<void> {
    try {
      const jsonData = await this.client.db.guilds.get('GLOBAL');
      if (!jsonData) return;
      const parsed = this.fromJSON(jsonData);
      this.data = parsed;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  private fromJSON(conf: any): IGlobalConfig {
    return {
      owner: conf.owner,
      globalPrefix: conf.globalPrefix,
      verbose: conf.verbose,
      devs: new Set(conf.devs),
      disabledGuilds: new Set(conf.disabledGuilds),
      disabledCommands: new Set(conf.disabledCommands),
      disabledUsers: new Set(conf.disabledUsers),
      loadedModules: new Set(conf.loadedModules),
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
      loadedModules: [...conf.loadedModules]
    };
  }
}
