import * as Keyv from 'keyv';
import { GuildID, IGuildConfig } from 'typings';
import { GuildConfig } from '../../Utils/GuildConfig';
import { Guild } from 'discord.js';
import { CitrineClient } from '../CitrineClient';

export class CitrineDB {
	public readonly guilds: Map<string, IGuildConfig>;
	public readonly client: CitrineClient;

	constructor(client: CitrineClient) {
		// TODO
		// THIS IS SUPPOSED TO BE A KEYV DB BTW!
		this.guilds = new Map();
		this.client = client;
	}

	public create(name: string) {
		return name;
	}

	public async getGuild(id: GuildID): Promise<GuildConfig | null> {
		try {
			const jsonData = this.guilds.get(id);
			if (jsonData) {
				const conf = new GuildConfig(jsonData);
				return Promise.resolve(conf);
			}
			return Promise.resolve(null);
		} catch (err) {
			this.client.logger.warn();
			return Promise.resolve(null);
		}
	}

	public async setGuild(guild: Guild | IGuildConfig): Promise<GuildConfig | null> {
		try {
			const conf = new GuildConfig(guild);
			this.guilds.set(guild.id, conf);

			return Promise.resolve(conf);
		} catch (err) {
			this.client.logger.warn();
			return Promise.resolve(null);
		}
	}

	public async unsetGuild(id: GuildID): Promise<boolean> {
		try {
			this.guilds.delete(id);
			return Promise.resolve(true);
		} catch (err) {
			this.client.logger.warn();
			return Promise.resolve(false);
		}
	}
}
