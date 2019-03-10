import { Message } from 'discord.js';
import { GuildConfig } from '../Utils/GuildConfig';
import { BaseCommand } from '../Utils/Command';
import { Command } from 'typings';

export class CmdHandler {
	constructor() {
		throw new Error('This class may not be instantiated!');
	}

	public static checkPrefix(message: Message, config: GuildConfig): string | null {
		return null;
	}

	public static getArgs(message: Message, config: GuildConfig, parseQuotes: boolean = true): string[] | null {
		return null;
	}

	public static getBaseCmd(message: Message, args: string[]): [BaseCommand, string[]] | null {
		return null;
	}

	public static getFinalCmd(message: Message, args: string[]): [Command, string[]] | null {
		return null;
	}

	public static *getCmdChainIterator(message: Message, args: string[]): IterableIterator<Command> {
		// Implement this!
	}

	public static processCommand(message: Message): void {
		// Does everything for the user, including custom filters!
	}
}
