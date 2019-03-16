import { Collection } from 'discord.js';
import { CommandOptions } from 'typings';
import { BaseCommand } from './BaseCommand';
import { SubCommand } from './SubCommand';

export type Command = SubCommand | BaseCommand | AbstractCommand;
type Class = (new(...args: any[]) => any);

export abstract class AbstractCommand {
	public subcommands?: Collection<string, SubCommand>;
	public readonly name: string;
	public readonly description: string;
	public readonly usage: string;

	constructor(name: string, options: CommandOptions) {
		this.name = name;
		this.description = options.description || 'No description provided :(';
		this.usage = options.usage || '';
	}

	public registerSubCommands(...subCmds: Array<Class>): Command {
		this.subcommands = new Collection();
		for (const subCmd of subCmds) {
			const instance = new subCmd();
			if (instance instanceof SubCommand) {
				this.subcommands.set(instance.name, instance);
				continue;
			}
			throw new Error('Only instances of the SubCommand class can be registered!');
		}
		return this;
	}
}
