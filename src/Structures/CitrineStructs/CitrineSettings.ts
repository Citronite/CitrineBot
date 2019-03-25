import * as path from 'path';
import { BaseError } from '../ErrorStructs/BaseError';
import { CitrineClient } from '../CitrineClient';
import { IGlobalConfig } from 'typings';

export class CitrineSettings {
	public readonly global: IGlobalConfig;
	public readonly stats: object;
	public readonly client: CitrineClient;

	constructor(client: CitrineClient) {
		// Implement this!
		this.client = client; // In the output JS files, use Reflect.defineProperty()

		// On launch, get the config from the db and replace this with that.
		this.global = {
			owner: 'DEFAULT',
			prefix: 'DEFAULT',
			devs: new Set(['DEFAULT']),
			disabledUsers: new Set(),
			disabledGuilds: new Set(),
			disabledCommands: new Set(),
			loadedModules: new Set(),
			aliases: {}
		};

		this.stats = {
			processedCommands: 0,
			messagesRead: 0,
		};
	}

	public async save(): Promise<boolean> {
		// To be implemented.
		// This function doesnt take or return anything. Simply saves the bot's current settings
		// e.g. stats and globalConfig to the db
		return Promise.reject(false);
	}

	public async load(): Promise<boolean> {
		// To be implemented
		// This function doesn't take or return anything. Simply fetches bot's settings
		// e.g. stats and globalConfig from the db, and updates them.
		return Promise.reject(false);
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

	public toJSON(): object {
		const conf = this.global;
		return {
			...conf,
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
		return false;
	}

}
