import Keyv = require('keyv');
import { mkdir } from 'fs';
import { GuildID } from 'typings';
import { GuildConfig } from '../../Utils/GuildConfig';
import { Guild } from 'discord.js';

const cwd = process.cwd();

interface ICitrineDB {
	[key: string]: any;
}

export class CitrineDB implements ICitrineDB {
	[key: string]: any;
	public readonly guilds: Keyv<any>;

	constructor() {
		this.guilds = new Keyv(`sqlite://${cwd}/data/core/guilds.sqlite`);
	}

	public async create(name: string, path: string): Promise<Keyv<any>> {
		try {
			this[name] = new Keyv(`sqlite://${cwd}/${path}`);
			return Promise.resolve(this[name]);
		} catch (err) {
			return Promise.reject(err);
		}
	}

	public async getGuild(id: GuildID): Promise<GuildConfig> {
		try {
			const jsonData = await this.guilds.get(id);
			if (jsonData) {
				const conf = new GuildConfig(jsonData);
				return Promise.resolve(conf);
			}
			throw new Error(`Unable to find GuildConfig for id: ${id}`);
		} catch (err) {
			return Promise.reject(err);
		}
	}

	public async setGuild(guild: Guild | GuildConfig | any): Promise<GuildConfig> {
		try {
			const conf = new GuildConfig(guild);
			await this.guilds.set(guild.id, conf.toJSON());
			return Promise.resolve(conf);
		} catch (err) {
			return Promise.reject(err);
		}
	}

	public async unsetGuild(id: GuildID): Promise<void> {
		try {
			await this.guilds.delete(id);
			return Promise.resolve();
		} catch (err) {
			return Promise.reject(err);
		}
	}

	public async initialSetup(): Promise<boolean> {
		const path = `${cwd}\\data\\core`;
		return new Promise((res, rej) => {
			mkdir(path, err => {
				if (err) return rej(err);
				return res(true);
			});
		});
	}
}
