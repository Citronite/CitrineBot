import * as fs from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';
import { Client, Collection } from 'discord.js';
import CmdHandler from './Handlers/CmdHandler';
import PermHandler from './Handlers/PermHandler';
import BaseCommand from './Command/BaseCommand';
import CitrineUtils from './Citrine/CitrineUtils';
import CitrineSettings from './Citrine/CitrineSettings';
import GuildConfig from './Utils/GuildConfig';
import Memory from './DbDrivers/Memory';
import ConsoleLogger from './Loggers/Console';
import { DbDriver, Logger, CitrineOptions, GuildID } from 'typings';

const root = resolve(`${__dirname}/../../`);
const { readdirSync } = fs;
const readdirAsync = promisify(fs.readdir);

function fileFilter(arr: string[]): string[] {
  return arr.filter(val => !val.startsWith('_') && val.endsWith('.js'));
}

function resolveDbDriver(options: any): new () => DbDriver {
  if (!options || !options.dbDriver) return Memory;

  const { dbDriver } = options;
  const drivers = fileFilter(readdirSync(`${root}/bin/Structures/DbDrivers`));
  if (drivers.includes(`${dbDriver}.js`)) {
    return require(`${root}/bin/Structures/DbDrivers/${dbDriver}.js`).default;
  } else {
    throw new Error('Invalid dbDriver option provided!');
  }
}

function resolveLogger(options: any): new () => Logger {
  if (!options || !options.logger) return ConsoleLogger;

  const { logger } = options;
  const loggers = fileFilter(readdirSync(`${root}/bin/Structures/Loggers`));
  if (loggers.includes(`${logger}.js`)) {
    return require(`${root}/bin/Structures/Loggers/${logger}.js`).default;
  } else {
    throw new Error('Invalid logger option provided!');
  }
}

async function initChips(client: CitrineClient): Promise<void> {
  const allChips = await readdirAsync(`${root}/bin/Chips`);
  const defaults = client.defaultChips;
  const chips = defaults.has('all') ? allChips : client.defaultChips;

  for (const chip of chips) await client.loadChip(chip);
}

export default class CitrineClient extends Client {
  public readonly settings: CitrineSettings;
  public readonly logger: Logger;
  public readonly utils: CitrineUtils;
  public readonly db: DbDriver;
  public readonly cmdHandler: CmdHandler;
  public readonly permHandler: PermHandler;
  public readonly commands: Collection<string, BaseCommand>;
  public readonly defaultChips: Set<string>;
  public lastException: Error | null; // Temporary?

  public constructor(options?: CitrineOptions) {
    super(options);

    this.settings = new CitrineSettings(this);
    this.permHandler = new PermHandler();
    this.cmdHandler = new CmdHandler();
    this.commands = new Collection();
    this.utils = new CitrineUtils();

    const dbDriver = resolveDbDriver(options);
    this.db = new dbDriver();
    const logger = resolveLogger(options);
    this.logger = new logger();

    this.defaultChips = new Set(['core']);
    if (options && options.defaultChips) {
      this.defaultChips = new Set(['core', ...options.defaultChips]);
    }

    this.lastException = null;
  }

  public async loadChip(chip: string): Promise<string> {
    try {
      const dir = await readdirAsync(`${root}/bin/Chips/${chip}`);
      const cmdFiles = fileFilter(dir);

      for (const file of cmdFiles) {
        const cmd = require(`../Chips/${chip}/${file}`);
        this.commands.set(cmd.name, cmd);
      }

      if (dir.includes('_setup.js')) {
        const { load: fn } = require(`../Chips/${chip}/_setup.js`);
        if (typeof fn === 'function') fn(this);
      }

      this.settings.addLoadedChip(chip);
      await this.settings.save();
      return Promise.resolve(`Successfully loaded chip: ${chip}`);
    } catch (err) {
      return Promise.reject(`Failed to load chip: ${chip}\n${err}`);
    }
  }

  public async unloadChip(chip: string): Promise<string> {
    try {
      this.commands.sweep(cmd => cmd.chip === chip);
      const dir = await readdirAsync(`${root}/bin/Chips/${chip}`);
      if (dir.includes('_setup.js')) {
        const { unload: fn } = require(`../Chips/${chip}/_setup.js`);
        if (typeof fn === 'function') fn(this);
      }

      this.settings.removeLoadedChip(chip);
      await this.settings.save();
      return Promise.resolve(`Successfully unloaded chip: ${chip}`);
    } catch (err) {
      return Promise.reject(`Failed to unload chip: ${chip}\n${err}`);
    }
  }

  public async clearChipCache(chip: string): Promise<string> {
    try {
      const basePath = resolve(`${root}/bin/Chips/${chip}`);
      const cachedPaths = Object.keys(require.cache);
      for (const path of cachedPaths) {
        if (path.startsWith(basePath)) delete require.cache[path];
      }
      return Promise.resolve(`Successfully cleared cache for chip: ${chip}`);
    } catch (err) {
      return Promise.reject(`Failed to clear cache for chip: ${chip}\n${err}`);
    }
  }

  public async updateMetaData(): Promise<void> {
    const data = require(`${root}/data/core/_instance.json`);
    const app = await this.fetchApplication();
 
    this.settings.owner = app.owner.id;

    data.botOwner = app.owner.id;
    data.appOwner = app.owner.id;
    data.appId = app.id;

    const path = `${root}/data/core/_instance.json`;
    const content = JSON.stringify(data, null, '  ');

    fs.writeFile(path, content, err => {
      if (err) this.logger.warn(err);
    });
  }

  // Starts Citrine!
  public async launch(): Promise<void> {
    try {
      this.logger.info('------------------');
      this.logger.info('Loading chips...');
      await initChips(this);

      this.logger.info('Fetching data...');
      const data = require(`${root}/data/core/_instance.json`);
      await this.settings.load();

      if (this.settings.globalPrefix === 'DEFAULT') {
        this.settings.globalPrefix = data.initialPrefix;
      }

      this.logger.info('\nLogging in to Discord...');
      await this.login(data.TOKEN);

      if (this.settings.owner === 'DEFAULT') {
        this.updateMetaData();
      }

      await this.settings.save();
    } catch (err) {
      this.logger.error(err);
    }
  }

  public async getGuild(id: GuildID): Promise<{ [key: string]: any } | undefined> {
    const db: any = this.db;
    const guild = await db.guilds.read(id);
    return guild ? new GuildConfig(guild) : undefined;
  }

  public async setGuild(id: GuildID, data: GuildConfig): Promise<void> {
    const guild = new GuildConfig(data);
    const db: any = this.db;
    await db.guilds.update(id, guild.toJSON());
  }

  public async delGuild(id: GuildID): Promise<void> {
    const db: any = this.db;
    await db.guilds.delete(id);
  }
}
