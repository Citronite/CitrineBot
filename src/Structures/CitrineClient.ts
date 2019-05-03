import * as fs from 'fs';
import { ICmdHandler, IPermHandler } from 'typings';
import { CmdHandler } from './Handlers/CmdHandler';
import { PermHandler } from './Handlers/PermHandler';
import { CitrineDB } from './CitrineStructs/CitrineDB';
import { BaseCommand } from './CommandStructs/BaseCommand';
import { CitrineUtils } from './CitrineStructs/CitrineUtils';
import { CitrineLogger } from './CitrineStructs/CitrineLogger';
import { CitrineSettings } from './CitrineStructs/CitrineSettings';
import {
  Client,
  ClientOptions,
  Collection
} from 'discord.js';

function fileFilter(arr: string[]): string[] {
  return arr.filter(val => !val.startsWith('_') && val.endsWith('.js'));
}

export class CitrineClient extends Client {
  public readonly settings: CitrineSettings;
  public readonly logger: CitrineLogger;
  public readonly utils: CitrineUtils;
  public readonly db: CitrineDB;
  public readonly cmdHandler: ICmdHandler;
  public readonly permHandler: IPermHandler;
  public readonly commands: Collection<string, BaseCommand>;
  public lastException: Error | null; // Temporary

  constructor(options: ClientOptions) {
    super(options);
    this.db = new CitrineDB();
    this.utils = new CitrineUtils();
    this.logger = new CitrineLogger(this);
    this.settings = new CitrineSettings(this);

    this.cmdHandler = CmdHandler;
    this.permHandler = PermHandler;
    this.commands = new Collection();

    // Eventually, move lastException and other stats
    // inside Client#settings
    this.lastException = null;
  }

  public initChips(defaultChips: string[]): boolean {
    try {
      const defaults = ['core'].concat(defaultChips);
      for (const chip of defaults) {
        const dir = fs.readdirSync(`./bin/Chips/${chip}`);
        const cmdFiles = fileFilter(dir);
        for (const file of cmdFiles) {
          const cmd = require(`../Chips/${chip}/${file}`);
          this.commands.set(cmd.name, cmd);
        }
        if (dir.includes('_onload.js')) {
          const onload = require(`../Chips/${chip}/_onload.js`);
          if (typeof onload === 'function') onload(null);
        }
      }
      this.logger.info('Successfully initialized default Chips!');
      return true;
    } catch (err) {
      this.logger.error(`Error initializing default Chips:\n  ${err.stack}`);
      throw 0;
    }
  }

  // Loads event files and then clears cache since
  // events should only be loaded once.
  public initEvents(): boolean {
    try {
      const eventFiles = fileFilter(fs.readdirSync('./bin/Events'));
      for (const file of eventFiles) {
        const event = require(`../Events/${file}`);
        if (event.listener) this.on(event.name, event.listener.bind(null, this));
        if (event.once) this.once(event.name, event.once.bind(null, this));
        delete require.cache[require.resolve(`../Events/${file}`)];
      }
      this.logger.info('Successfully initialized event listeners!');
      return true;
    } catch (err) {
      this.logger.error(`Error initializing event listeners:\n  ${err.stack}`);
      throw 0;
    }
  }

  public async loadChip(): Promise<boolean> {
    return Promise.reject(false);
  }

  public async unloadChip(): Promise<boolean> {
    return Promise.reject(false);
  }

  public async clearCachedChip(): Promise<boolean> {
    return Promise.reject(false);
  }

  // Starts bot!
  public async launch(): Promise<void> {
    try {
      this.logger.info('\nFetching data. . .');
      const { TOKEN, prefix } = require('../../data/core/_settings.json');
      await this.settings.load();

      if (this.settings.globalPrefix === 'DEFAULT') this.settings.globalPrefix = prefix;

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
