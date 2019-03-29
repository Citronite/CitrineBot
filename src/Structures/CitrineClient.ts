import { CitrineSettings } from './CitrineStructs/CitrineSettings';
import { CitrineLogger } from './CitrineStructs/CitrineLogger';
import { CitrineUtils } from './CitrineStructs/CitrineUtils';
import { CitrineDB } from './CitrineStructs/CitrineDB';
import { Client, ClientOptions } from 'discord.js';
import { CmdHandler } from './Handlers/CmdHandler';
import { PermHandler } from './Handlers/PermHandler';
import { ICmdHandler, IPermHandler } from 'typings';
import * as fs from 'fs';

export class CitrineClient extends Client {
	public readonly settings: CitrineSettings;
	public readonly logger: CitrineLogger;
	public readonly utils: CitrineUtils;
	public readonly db: CitrineDB;

	public readonly cmdHandler: ICmdHandler;
	public readonly permHandler: IPermHandler;

	constructor(options: ClientOptions) {
		super(options);

		this.settings = new CitrineSettings(this);
		this.logger = new CitrineLogger(this);
		this.utils = new CitrineUtils();
		this.db = new CitrineDB();

		this.cmdHandler = CmdHandler;
		this.permHandler = PermHandler;
	}

	public initChips(defaultChips: string[]): boolean {
		return !!defaultChips;
	}

	public initEvents(): boolean {
		return 1 > 0;
	}

	public initDB(): boolean {
		return 1 > 0;
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

	public async reloadChip(): Promise<boolean> {
		return Promise.reject(false);
	}

	public async launch(): Promise<void> {
		// Starts bot!
		try {
			const { token, prefix } = require('../data/core/_settings.json');
			await this.settings.load();

			if (this.settings.globalPrefix === 'DEFAULT') this.settings.globalPrefix = prefix;

			await this.login(token);
			if (this.settings.owner === 'DEFAULT') {
				const app = await this.fetchApplication();
				this.settings.owner = app.owner.id;
			}

			await this.settings.save();
			Promise.resolve();
		} catch (err) {
			return Promise.reject(err);
		}
	}
}
