import * as path from 'path';
import { IGlobalConfig, GuildID } from 'typings';
import { GuildConfig } from '../../Utils/GuildConfig';
import { Guild } from 'discord.js';
import { CommonError } from '../ErrorStructs/CommonError';
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
			disabledCommands: new Set(['DEFAULT'])
		};
	}

	public getGuild(id: GuildID): GuildConfig | null {
		return;
	}

	public setGuild(guild: Guild): GuildConfig | CommonError {
		return;
	}

	public getModule(name: string): ModuleConfig | null {
		return;
	}

	public setModule(module: object): ModuleConfig | CommonError {
		return;
	}

	public toJSON(): object {
		const conf = this.globalConfig;
		return {
			...conf,
			disabledUsers: [...conf.disabledUsers],
			disabledGuilds: [...conf.disabledGuilds],
			disabledCommands: [...conf.disabledCommands],
		};
	}

	public fromJSON(conf: any): IGlobalConfig {
		return {
			owner: conf.owner,
			prefix: conf.prefix,
			devs: new Set(conf.devs),
			disabledGuilds: new Set(conf.disabledGuilds),
			disabledCommands: new Set(conf.disabledCommands),
			disabledUsers: new Set(conf.disabledUsers)
		};
	}

	public toString(): string {
		const obj = this.toJSON();
		return JSON.stringify(obj, null, '\t');
	}

}
