import Keyv = require('keyv');
import { GuildID } from 'typings';
import { GuildConfig } from '../Utils/GuildConfig';
import { Guild } from 'discord.js';
import { resolve } from 'path';

const cwd = process.cwd();

export class CitrineDB {
  [key: string]: any;
  public readonly guilds: Keyv<any>;

  constructor() {
    this.guilds = new Keyv(`sqlite://${cwd}/data/core/guilds.sqlite`);
  }

  public async create(name: string, path: string): Promise<Keyv<any>> {
    try {
      this[name] = new Keyv(`sqlite://${resolve(path)}`);
      return Promise.resolve(this[name]);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async drop(): Promise<boolean> {
  try {
    return Promise.reject('Unimplemented');
  } catch (err) {
    return Promise.reject(err);
  }
}

  public async getGuild(id: GuildID): Promise<GuildConfig | null> {
    try {
      const jsonData = await this.guilds.get(id);
      if (jsonData) {
        const conf = new GuildConfig(jsonData);
        return Promise.resolve(conf);
      }
      return Promise.resolve(null);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async setGuild(guild: Guild | GuildConfig | any): Promise<GuildConfig | null> {
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
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
