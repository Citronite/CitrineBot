import * as fs from 'fs';
import { CitrineClient } from '../CitrineClient';
import { IGlobalConfig } from 'typings';

export class CitrineSettings {
	public readonly client: CitrineClient;
	private config: IGlobalConfig;

	constructor(client: CitrineClient) {
		this.client = client;

		this.config = {
			owner: 'DEFAULT',
			globalPrefix: 'DEFAULT',
			devs: new Set(),
			disabledUsers: new Set(),
			disabledGuilds: new Set(),
			disabledCommands: new Set(),
			loadedModules: new Set(),
			aliases: {}
		};
	}

	get owner(): string {
		return this.config.owner;
	}

	set owner(id: string) {
		this.config.owner = id;
	}

	get globalPrefix(): string {
		return this.config.globalPrefix;
	}

	set globalPrefix(str) {
		this.config.globalPrefix = str;
	}

	get devs(): string[] {
		return [...this.config.devs];
	}

	public addDev(id: string): void {
		this.config.devs.add(id);
	}

	public removeDev(id: string): void {
		this.config.devs.delete(id);
	}

	get disabledUsers(): string[] {
		return [...this.config.disabledUsers];
	}

	public disableUser(id: string): void {
		this.config.disabledUsers.add(id);
	}

	public enableUser(id: string): void {
		this.config.disabledUsers.delete(id);
	}

	get disabledGuilds(): string[] {
		return [...this.config.disabledGuilds];
	}

	public disableGuild(id: string): void {
		this.config.disabledGuilds.add(id);
		const guild = this.client.guilds.get(id);
		if (guild) {
			guild.leave();
		}
	}

	public enableGuild(id: string): void {
		this.config.disabledGuilds.delete(id);
	}

	get disabledCommands(): string[] {
		return [...this.config.disabledCommands];
	}

	public disableCommand(name: string): void {
		this.config.disabledCommands.add(name);
	}

	public enableCommand(name: string): void {
		this.config.disabledCommands.delete(name);
	}

	get loadedModules(): string[] {
		return [...this.config.loadedModules];
	}

	public addLoadedModule(name: string): void {
		this.config.loadedModules.add(name);
	}

	public removeLoadedModule(name: string): void {
		this.config.loadedModules.delete(name);
	}

	get aliases(): object {
		return this.config.aliases;
	}

	public setAlias(cmd: string, alias: string): void {
		const aliases = this.config.aliases[cmd] ? new Set(this.config.aliases[cmd]) : new Set();
		aliases.add(alias);
		this.config.aliases[cmd] = [...aliases];
	}

	public unsetAlias(cmd: string, alias: string): void {
		if (!this.config.aliases[cmd]) return;
		const aliases = new Set(this.config.aliases[cmd]);
		aliases.delete(alias);
		this.config.aliases[cmd] = [...aliases];
	}

	public async save(): Promise<void> {
		try {
			const jsonData = this.toJSON();
			await this.client.db.guilds.set('GLOBAL', jsonData);
			Promise.resolve();
		}	catch (err) {
			Promise.reject(err);
		}
		return Promise.reject(false);
	}

	public async load(): Promise<void> {
		try {
			const jsonData = await this.client.db.guilds.get('GLOBAL');
			const parsed = this.fromJSON(jsonData);
			this.config = parsed;
			return Promise.reject();
		} catch (err) {
			return Promise.reject(err);
		}
	}

	public fromJSON(conf: any): IGlobalConfig {
		return {
			owner: conf.owner,
			globalPrefix: conf.globalPrefix,
			devs: new Set(conf.devs),
			disabledGuilds: new Set(conf.disabledGuilds),
			disabledCommands: new Set(conf.disabledCommands),
			disabledUsers: new Set(conf.disabledUsers),
			loadedModules: new Set(conf.loadedModules),
			aliases: conf.aliases
		};
	}

	public toJSON(): object {
		const conf = this.config;
		return {
			...conf,
			devs: [...conf.devs],
			disabledUsers: [...conf.disabledUsers],
			disabledGuilds: [...conf.disabledGuilds],
			disabledCommands: [...conf.disabledCommands],
			loadedModules: [...conf.loadedModules]
		};
	}

	public toString(): string {
		const obj = this.toJSON();
		return JSON.stringify(obj, null, '\t');
	}

	public static async initialSetup(token: string, prefix: string): Promise<boolean> {
		const data = JSON.stringify({ token, prefix });
		return new Promise((res, rej) => {
			fs.writeFile(`${process.cwd()}/data/core/_settings.json`, data, err => {
				if (err) return rej(err);
				return res(true);
			});
		});
	}

}
