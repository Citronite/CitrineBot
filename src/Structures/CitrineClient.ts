import { Client } from 'discord.js';

export class CitrineClient extends Client {
	constructor() {
		super();
	}

	public initModules(): boolean {
		return 1 > 0;
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
		return Promise.reject(false);
	}
}
