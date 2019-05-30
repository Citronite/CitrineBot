import * as fs from 'fs';
import { promisify } from 'util';
import { CmdHandler } from './Handlers/CmdHandler';
import { PermHandler } from './Handlers/PermHandler';
import { SQLiteKV } from '../DBProviders/SQLiteKV';
import { BaseCommand } from './CommandStructs/BaseCommand';
import { CitrineUtils } from './CitrineStructs/CitrineUtils';
import { CitrineLogger } from './CitrineStructs/CitrineLogger';
import { CitrineSettings } from './CitrineStructs/CitrineSettings';
import { Client, Collection } from 'discord.js';
import {
  CitrineOptions,
  DbProvider,
  Utils,
  Logger,
  ICmdHandler,
  IPermHandler
} from 'typings';

const readdirSync = fs.readdirSync;
const readdirAsync = promisify(fs.readdir);
function fileFilter(arr: string[]): string[] {
  return arr.filter(val => !val.startsWith('_') && val.endsWith('.js'));
}

export class CitrineClient extends Client {
  public readonly settings: CitrineSettings;
  public readonly logger: Logger;
  public readonly utils: Utils;
  public readonly db: DbProvider | any;
  public readonly cmdHandler: ICmdHandler;
  public readonly permHandler: IPermHandler;
  public readonly commands: Collection<string, BaseCommand>;
  public readonly defaultChips: Set<string>;
  public lastException: Error | null; // Temporary

  constructor(options?: CitrineOptions) {
    super(options);
    this.settings = new CitrineSettings(this);
    this.commands = new Collection();

    this.db = options && options.dbProvider ? new options.dbProvider() : new SQLiteKV();
    this.utils = options && options.utils ? new options.utils() : new CitrineUtils();
    this.logger = options && options.logger ? new options.logger() : new CitrineLogger();
    this.cmdHandler = options && options.cmdHandler ? new options.cmdHandler() : new CmdHandler();
    this.permHandler = options && options.permHandler ? new options.permHandler() : new PermHandler();
    this.defaultChips = new Set(['core']);

    if (options && options.defaultChips) {
      this.defaultChips = new Set(['core', ...options.defaultChips]);
    }

    // Eventually, move lastException and other
    // misc. properties inside CitrineClient#settings
    this.lastException = null;
  }

  // Loads all chips from the Chips folder.
  // Removes the core chip from cache since it is only loaded once.
  public initChips(): void {
    try {
      const allChips = readdirSync('./bin/Chips');
      for (const chip of this.defaultChips) {
        if (!allChips.includes(chip)) continue;
        const dir = readdirSync(`./bin/Chips/${chip}`);
        const cmdFiles = fileFilter(dir);
        for (const file of cmdFiles) {
          const cmd = require(`../Chips/${chip}/${file}`);
          this.commands.set(cmd.name, cmd);
          if (chip === 'core') {
            delete require.cache[require.resolve(`../Chips/core/${file}`)];
          }
        }
        if (dir.includes('_setup.js')) {
          const { load } = require(`../Chips/${chip}/_setup.js`);
          if (typeof load === 'function') load(this);
        }
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
      const eventFiles = fileFilter(readdirSync('./bin/Events'));
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

  public async loadChip(chip: string): Promise<void> {
    try {
      const allChips = await readdirAsync('./bin/Chips');
      if (!allChips.includes(chip)) {
        return Promise.reject(`Unable to find chip: ${chip}!`);
      }
      const dir = await readdirAsync(`./bin/Chips/${chip}`);
      const cmdFiles = fileFilter(dir);
      for (const file of cmdFiles) {
        const cmd = require(`../Chips/${chip}/${file}`);
        this.commands.set(cmd.name, cmd);
      }
      if (dir.includes('_setup.js')) {
        const { load } = require(`../Chips/${chip}/_setup.js`);
        if (typeof load === 'function') load(this);
      }
      this.logger.info(`Successfully loaded chip: ${chip}`);
      return Promise.resolve();
    } catch (err) {
      this.logger.warn(`Failed to load chip: ${chip}`);
      return Promise.reject(err);
    }
  }

  public async unloadChip(chip: string): Promise<void> {
    try {
      const dir = await readdirAsync(`./bin/Chips/${chip}`);
      if (dir.includes('_setup.js')) {
        const { unload } = require(`../Chips/${chip}/_setup.js`);
        if (typeof unload === 'function') unload(this);
      }
      this.commands.sweep((cmd) => cmd.chip === chip);
      this.logger.info(`Successfully unloaded chip: ${chip}`);
      return Promise.resolve();
    } catch (err) {
      this.logger.warn(`Failed to unload chip: ${chip}`);
      return Promise.reject(err);
    }
  }

  public async clearChipCache(chip: string): Promise<void> {
    try {
      const dir = await readdirAsync(`./bin/Chips/${chip}`);
      const cmdFiles = fileFilter(dir);
      for (const file of cmdFiles) {
        delete require.cache[require.resolve(`../Chips/${chip}/${file}`)];
      }
      this.logger.info(`Successfully cleared cache for chip: ${chip}`);
      return Promise.resolve();
    } catch (err) {
      this.logger.warn(`Failed to clear cache for chip: ${chip}`);
      return Promise.reject(err);
    }
  }

  // Starts bot!
  public async launch(): Promise<void> {
    try {
      this.logger.info('\nFetching data. . .');
      const { TOKEN, initialPrefix } = require('../../data/core/_instance.json');
      await this.settings.load();
      if (this.settings.globalPrefix === 'DEFAULT') {
        this.settings.globalPrefix = initialPrefix;
      }

      this.logger.info('\nLogging in to Discord. . .');
      await this.login(TOKEN);

      if (this.settings.owner === 'DEFAULT') {
        const app = await this.fetchApplication();
        this.settings.owner = app.owner.id;
      }
      await this.settings.save();
    } catch (err) {
      this.logger.error(err);
      return Promise.reject(err);
    }
  }
}
