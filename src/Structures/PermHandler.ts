import { Command } from 'typings';
import { Message } from 'discord.js';

export class PermHandler {
	constructor() {
		throw new Error('This class may not be instantiated!');
	}

	public static checkCustomFilters(cmd: Command, message: Message): Error | void {
		return false;
	}
}
