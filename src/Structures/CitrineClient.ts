import { CitrineSettings } from './CitrineStructs/CitrineSettings';
import { CitrineLogger } from './CitrineStructs/CitrineLogger';
import { CitrineUtils } from './CitrineStructs/CitrineUtils';
import { CitrineDB } from './CitrineStructs/CitrineDB';
import { Client, ClientOptions } from 'discord.js';
import { CmdHandler } from './Handlers/CmdHandler';
import { PermHandler } from './Handlers/PermHandler';
import { ICmdHandler, IPermHandler } from 'typings';
import { BaseCommand } from './CommandStructs/BaseCommand';
import { Collection } from 'discord.js';
import * as fs from 'fs';
import * as pfs from '../Utils/promisefs';

function fileFilter(arr: string[]): string[] {
  return arr.filter(val => {
    return !val.startsWith('_') && val.endsWith('.js');
  });
}

export class CitrineClient extends Client {
  public readonly settings: CitrineSettings;
  public readonly logger: CitrineLogger;
  public readonly utils: CitrineUtils;
  public readonly db: CitrineDB;
  public readonly cmdHandler: ICmdHandler;
  public readonly permHandler: IPermHandler;
  public readonly commands: Collection<string, BaseCommand>;

  constructor(options: ClientOptions) {
    super(options);

    this.settings = new CitrineSettings(this);
    this.logger = new CitrineLogger(this);
    this.utils = new CitrineUtils();
    this.db = new CitrineDB();

    this.cmdHandler = CmdHandler;
    this.permHandler = PermHandler;

    this.commands = new Collection();
  }

  public initChips(defaultChips: string[]): boolean {
    try {
      const defaults = ['core'].concat(defaultChips);

      for (const chip of defaults) {
        const files = fs.readdirSync(`./bin/Chips/${chip}`);
        const cmdFiles = fileFilter(files);
        for (const file of cmdFiles) {
          const cmd = require(`../Chips/${chip}/${file}`);
          this.commands.set(cmd.name, cmd);
        }
        if (files.includes('_onload.js')) {
          const onload = require(`../Chips/${chip}/_onload.js`);
          if (typeof onload === 'function') onload(null);
        }
        this.logger.info(`Loaded Chip [${chip}]`);
      }

      this.logger.info('Successfully initialized default Chips!');
      return true;
    } catch (err) {
      this.logger.error(`Error initializing default Chips:\n  ${err.stack}`);
      return false;
    }
  }

  public initEvents(): boolean {
    try {
      const eventFiles = fileFilter(fs.readdirSync('./bin/Events'));

      for (const file of eventFiles) {
        const event = require(`../Events/${file}`);
        if (event.listener) this.on(event.name, event.listener.bind(null, this));
        if (event.once) this.once(event.name, event.once.bind(null, this));
        // Clear cache
        delete require.cache[require.resolve(`../Events/${file}`)];
      }

      this.logger.info('Successfully initialized event listeners!');
      return true;
    } catch (err) {
      this.logger.error(`Error initializing event listeners:\n  ${err.stack}`);
      return false;
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

  public async launch(): Promise<void> {
    // Starts bot!
    try {
      this.logger.info('Fetching data. . .');
      const { TOKEN, prefix } = require('../../data/core/_settings.json');
      await this.settings.load();

      if (this.settings.globalPrefix === 'DEFAULT') this.settings.globalPrefix = prefix;

      this.logger.info('Logging in to Discord. . .');
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
