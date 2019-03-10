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

	public launch(TOKEN: string): void {
		// Starts bot!
	}
}
