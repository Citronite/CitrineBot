import { CitrineSettings } from './CitrineStructs/CitrineSettings';
import { CitrineLogger } from './CitrineStructs/CitrineLogger';
import { CitrineUtils } from './CitrineStructs/CitrineUtils';
import { CitrineDB } from './CitrineStructs/CitrineDB';
import { Client, ClientOptions } from 'discord.js';
import { CmdHandler } from './Handlers/CmdHandler';
import { PermHandler } from './Handlers/PermHandler';

export class CitrineClient extends Client {
	public readonly settings: CitrineSettings;
	public readonly logger: CitrineLogger;
	public readonly utils: CitrineUtils;
	public readonly db: CitrineDB;

	public readonly cmdHandler: CmdHandler;
	public readonly permHandler: PermHandler;

	constructor(options: ClientOptions) {
		super(options);

		this.settings = new CitrineSettings(this);
		this.logger = new CitrineLogger();
		this.utils = new CitrineUtils();
		this.db = new CitrineDB();

		this.cmdHandler = CmdHandler;
		this.permHandler = PermHandler;
	}

	public initModules(defaultModules: string[]): boolean {
		return !!defaultModules;
	}

	public initEvents(): boolean {
		return 1 > 0;
	}

	public initDB(): boolean {
		return 1 > 0;
	}

	public async loadModule(): Promise<boolean> {
		return Promise.reject(false);
	}

	public async unloadModule(): Promise<boolean> {
		return Promise.reject(false);
	}

	public async clearCachedModule(): Promise<boolean> {
		return Promise.reject(false);
	}

	public async reloadModule(): Promise<boolean> {
		return Promise.reject(false);
	}

	public async launch(TOKEN: string): Promise<boolean> {
		// Starts bot!
		return Promise.reject(TOKEN);
	}
}
