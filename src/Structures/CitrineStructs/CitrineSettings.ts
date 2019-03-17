import * as path from 'path';
import { IGlobalConfig, GuildID } from 'typings';
import { GuildConfig } from '../../Utils/GuildConfig';
import { Guild } from 'discord.js';
import { BaseError } from '../ErrorStructs/BaseError';
import { CitrineClient } from '../CitrineClient';

export class CitrineSettings {
	public globalConfig: IGlobalConfig;
	public readonly client: CitrineClient;
	constructor(client: CitrineClient) {
		// Implement this!
		this.client = client; // In the output JS files, use Reflect.defineProperty()

		// On launch, get the config from the db and replace this with that.
		this.globalConfig = {
			owner: 'DEFAULT',
			prefix: 'DEFAULT',
			devs: new Set(['DEFAULT']),
			disabledUsers: new Set(['DEFAULT']),
			disabledGuilds: new Set(['DEFAULT']),
			disabledCommands: new Set(['DEFAULT']),
			loadedModules: new Set(['core']),
			aliases: {}
		};
	}

	public async getGuild(id: GuildID): Promise<GuildConfig | null> {
		const conf = new GuildConfig(this.client.db.guilds.get(id));
		return conf || null;
	}

	public async setGuild(guild: Guild): Promise<GuildConfig | Error> {
		const conf = this.client.db.guilds.set(new GuildConfig(guild));
		return conf;
	}
/*
	public getModule(name: string): ModuleConfig | null {
		return;
	}

	public setModule(module: object): ModuleConfig | BaseError {
		return;
	}
*/
	public toJSON(): object {
		const conf = this.globalConfig;
		return {
			...conf,
			disabledUsers: [...conf.disabledUsers],
			disabledGuilds: [...conf.disabledGuilds],
			disabledCommands: [...conf.disabledCommands],
			loadedModules: [...conf.loadedModules]
		};
	}

	public fromJSON(conf: any): IGlobalConfig {
		return {
			owner: conf.owner,
			prefix: conf.prefix,
			devs: new Set(conf.devs),
			disabledGuilds: new Set(conf.disabledGuilds),
			disabledCommands: new Set(conf.disabledCommands),
			disabledUsers: new Set(conf.disabledUsers),
			loadedModules: new Set(conf.loadedModules),
			aliases: conf.aliases
		};
	}

	public toString(): string {
		const obj = this.toJSON();
		return JSON.stringify(obj, null, '\t');
	}

}
