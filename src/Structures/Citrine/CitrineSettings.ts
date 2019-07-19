import CitrineClient from '../CitrineClient';
import { GlobalConfigData } from 'typings';

export default class CitrineSettings {
  public readonly client: CitrineClient;
  private data: GlobalConfigData;

  public constructor(client: CitrineClient) {
    this.client = client;
    this.data = {
      owner: 'DEFAULT',
      globalPrefix: 'DEFAULT',
      verbose: true,
      devs: [],
      disabledUsers: [],
      disabledGuilds: [],
      disabledCommands: [],
      loadedChips: [],
      aliases: {}
    };
  }

  public get owner(): string {
    return this.data.owner;
  }

  public set owner(id: string) {
    this.data.owner = id;
  }

  public get globalPrefix(): string {
    return this.data.globalPrefix;
  }

  public set globalPrefix(str: string) {
    this.data.globalPrefix = str;
  }

  public get verbose(): boolean {
    return this.data.verbose;
  }

  public set verbose(val: boolean) {
    this.data.verbose = val;
  }

  public get devs(): string[] {
    return [...this.data.devs];
  }

  public addDev(id: string): void {
    const tmp = new Set(this.data.devs);
    tmp.add(id);
    this.data.devs = [...tmp];
  }

  public removeDev(id: string): void {
    const tmp = new Set(this.data.devs);
    tmp.delete(id);
    this.data.devs = [...tmp];
  }

  public get disabledUsers(): string[] {
    return [...this.data.disabledUsers];
  }

  public disableUser(id: string): void {
    if (id === this.owner) return;
    if (id === this.client.user.id) return;
    const tmp = new Set(this.data.disabledUsers);
    tmp.add(id);
    this.data.disabledUsers = [...tmp];
  }

  public enableUser(id: string): void {
    const tmp = new Set(this.data.disabledUsers);
    tmp.delete(id);
    this.data.disabledUsers = [...tmp];
  }

  public get disabledGuilds(): string[] {
    return [...this.data.disabledGuilds];
  }

  public disableGuild(id: string): void {
    const tmp = new Set(this.data.disabledGuilds);
    tmp.add(id);
    this.data.disabledGuilds = [...tmp];
    const guild = this.client.guilds.get(id);
    if (guild) guild.leave();
  }

  public enableGuild(id: string): void {
    const tmp = new Set(this.data.disabledGuilds);
    tmp.delete(id);
    this.data.disabledGuilds = [...tmp];
  }

  public get disabledCommands(): string[] {
    return [...this.data.disabledCommands];
  }

  public disableCommand(name: string): void {
    const tmp = new Set(this.data.disabledCommands);
    tmp.add(name);
    this.data.disabledCommands = [...tmp];
  }

  public enableCommand(name: string): void {
    const tmp = new Set(this.data.disabledCommands);
    tmp.delete(name);
    this.data.disabledCommands = [...tmp];
  }

  public get loadedChips(): string[] {
    return [...this.data.loadedChips];
  }

  public addLoadedChip(name: string): void {
    const tmp = new Set(this.data.loadedChips);
    tmp.add(name);
    this.data.loadedChips = [...tmp];
  }

  public removeLoadedChip(name: string): void {
    if (name === 'core') return;
    const tmp = new Set(this.data.loadedChips);
    tmp.delete(name);
    this.data.loadedChips = [...tmp];
  }

  public get aliases(): { [key: string]: any } {
    return this.data.aliases;
  }

  public addAlias(cmd: string, alias: string): void {
    const aliases: Set<string> = this.data.aliases[cmd]
      ? new Set(this.data.aliases[cmd])
      : new Set();
    aliases.add(alias);
    this.data.aliases[cmd] = [...aliases];
  }

  public removeAlias(cmd: string, alias: string): void {
    if (!this.data.aliases[cmd]) return;
    const aliases = new Set(this.data.aliases[cmd]);
    aliases.delete(alias);
    this.data.aliases[cmd] = [...aliases];
  }

  public async save(): Promise<void> {
    try {
      const db: any = this.client.db;
      if (!db || !db.global) throw new Error('CitrineClient#db uninitialized!');
      await db.global.update('GLOBAL', this.data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async load(): Promise<void> {
    try {
      const db: any = this.client.db;
      if (!db || !db.global) throw new Error('CitrineClient#db uninitialized!');
      const jsonData = await db.global.read('GLOBAL');
      if (!jsonData) return;
      this.data = jsonData;
    } catch (err) {
      return Promise.reject(err);
    }
  }
  /*
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
*/
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
