import * as Keyv from 'keyv';
import { GuildID, IGuildConfig } from 'typings';
import { GuildConfig } from '../../Utils/GuildConfig';
import { Guild } from 'discord.js';

export class CitrineDB {
	constructor() {
		// TODO
	}

	public create(name: string) {
		return name;
	}

	public async getGuild(id: GuildID): Promise<GuildConfig | null> {
		try {
			const jsonData = await this.client.db.guilds.get(id);
			const conf = new GuildConfig(jsonData);
			return Promise.resolve(conf);
		} catch (err) {
			return Promise.resolve(null);
		}
	}

	public async setGuild(guild: Guild | IGuildConfig): Promise<GuildConfig | null> {
		try {
			const conf = new GuildConfig(guild);
			await this.client.db.guilds.set(guild.id, conf.toJSON);
			return Promise.resolve(conf);
		} catch (err) {
			return Promise.resolve(null);
		}
	}

	public async unsetGuild(id: GuildID): Promise<boolean> {
		try {
			await this.client.db.guilds.delete(id);
			return Promise.resolve(true);
		} catch (err) {
			return Promise.resolve(false);
		}
	}
}
