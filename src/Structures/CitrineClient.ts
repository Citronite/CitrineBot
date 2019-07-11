import * as fs from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';
import CmdHandler from './Handlers/CmdHandler';
import PermHandler from './Handlers/PermHandler';
import BaseCommand from './Command/BaseCommand';
import CitrineUtils from './Citrine/CitrineUtils';
import CitrineSettings from './Citrine/CitrineSettings';
import GuildConfig from './Utils/GuildConfig';
import Memory from './DbDrivers/Memory';
import ConsoleLogger from './Loggers/Console';
import { Client, Collection } from 'discord.js';

const root = resolve(`${__dirname}/../../`);
const { readdirSync } = fs;
const readdirAsync = promisify(fs.readdir);
function fileFilter(arr: string[]): string[] {
  return arr.filter(val => !val.startsWith('_') && val.endsWith('.js'));
}

function resolveDbDriver(options: any): new () => DbDriver {
  if (!options || !options.dbDriver) return Memory;
  else {
    const { dbDriver } = options;
    const drivers = fileFilter(readdirSync(`${root}/bin/Structures/DbDrivers`));
    if (drivers.includes(`${dbDriver}.js`)) {
      return require(`${root}/bin/Structures/DbDrivers/${dbDriver}.js`).default;
    } else {
      throw new Error('Invalid dbDriver option provided!');
    }
  }
}

function resolveLogger(options: any): new () => Logger {
  if (!options || !options.logger) return ConsoleLogger;
  else {
    const { logger } = options;
    const loggers = fileFilter(readdirSync(`${root}/bin/Structures/Loggers`));
    if (loggers.includes(`${logger}.js`)) {
      return require(`${root}/bin/Structures/Loggers/${logger}.js`).default;
    } else {
      throw new Error('Invalid logger option provided!');
    }
  }
}

export default class CitrineClient extends Client {
  public readonly settings: CitrineSettings;
  public readonly logger: Logger;
  public readonly utils: CitrineUtils;
  public readonly db: DbDriver;
  public readonly cmdHandler: CmdHandler;
  public readonly permHandler: PermHandler;
  public readonly commands: Collection<string, BaseCommand>;
  public readonly defaultChips: string[];
  public lastException: Error | null; // Temporary?

  public constructor(options?: CitrineOptions) {
    super(options);

    this.settings = new CitrineSettings(this);
    this.commands = new Collection();

    this.utils = new CitrineUtils();
    this.cmdHandler = new CmdHandler();
    this.permHandler = new PermHandler();

    const dbDriver = resolveDbDriver(options);
    this.db = new dbDriver();
    const logger = resolveLogger(options);
    this.logger = new logger();

    this.defaultChips = ['core'];
    if (options && options.defaultChips) {
      this.defaultChips = ['core', ...options.defaultChips];
    }

    this.lastException = null;

    this.on('error', () => this.logger.error('Connection error. . .'));
    this.on('reconnecting', () => this.logger.warn('Reconnecting. . .'));
    this.on('resume', () => this.logger.info('Connection resumed!'));
  }

  // Loads all chips from the Chips folder.
  // Removes the core chip from cache since it is only loaded once.
  public initChips(): void {
    try {
      const allChips = readdirSync(`${root}/bin/Chips`);
      const chips = this.defaultChips.includes('all') ? allChips : this.defaultChips;
      for (const chip of chips) {
        if (!allChips.includes(chip)) {
          throw new Error(
            `Unable to find chip ${chip}. If it exists, make sure it is placed in ./bin/Chips`
          );
        }
        const dir = readdirSync(`${root}/bin/Chips/${chip}`);
        const cmdFiles = fileFilter(dir);
        for (const file of cmdFiles) {
          const cmd = require(`../Chips/${chip}/${file}`);
          this.commands.set(cmd.name, cmd);
          if (chip === 'core') {
            delete require.cache[require.resolve(`../Chips/core/${file}`)];
          }
        }
        if (dir.includes('_setup.js')) {
          const { load: fn } = require(`../Chips/${chip}/_setup.js`);
          if (typeof fn === 'function') fn(this);
        }
        this.settings.addLoadedChip(chip);
      }
      this.logger.info('Successfully initialized default Chips!');
    } catch (err) {
      this.logger.error(`Error initializing default Chips:\n  ${err.stack}`);
      throw 0;
    }
  }

  // Loads event files and then clears cache since
  // events should only be loaded once.
  public initEvents(): void {
    try {
      const eventFiles = fileFilter(readdirSync(`${root}/bin/Events`));
      for (const file of eventFiles) {
        const event = require(`../Events/${file}`);
        if (event.listener) this.on(event.name, event.listener.bind(null, this));
        if (event.once) this.once(event.name, event.once.bind(null, this));
        delete require.cache[require.resolve(`../Events/${file}`)];
      }
      this.logger.info('Successfully initialized event listeners!');
    } catch (err) {
      this.logger.error(`Error initializing event listeners:\n  ${err.stack}`);
      throw 0;
    }
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

  // Starts Citrine!
  public async launch(): Promise<void> {
    try {
      this.initChips();
      this.initEvents();

      this.logger.info('\nFetching data. . .');
      const data = require(`${root}/data/core/_instance.json`);
      await this.settings.load();

      if (this.settings.globalPrefix === 'DEFAULT') {
        this.settings.globalPrefix = data.initialPrefix;
      }

      this.logger.info('\nLogging in to Discord. . .');
      await this.login(data.TOKEN);

      if (this.settings.owner === 'DEFAULT') {
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
