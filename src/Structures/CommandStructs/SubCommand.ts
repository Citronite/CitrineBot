import { AbstractCommand, Command } from './AbstractCommand';
import { BaseCommand } from './BaseCommand';
import { CommandOptions } from 'typings';
import { BuildEmbed } from '../../Utils/BuildEmbed';
import { Context } from '../../Utils/Context';

export class SubCommand extends AbstractCommand {
	private parent?: Command;
	private base?: BaseCommand;

	constructor(name: string, options: CommandOptions) {
		super(name, options);
	}

	public setParent(cmd: Command): void | Error {
		if (this.parent) throw new Error('Parent commands cannot be reset!');

		if (cmd instanceof BaseCommand || cmd instanceof SubCommand) {
			this.parent = cmd;
		}
	}

	public getParent(): Command | undefined {
		return this.parent;
	}

	public setBase(cmd: Command): void | Error {
		if (this.base) throw new Error('Base commands cannot be reset!');

		if (cmd instanceof BaseCommand) {
			this.base = cmd;
		}	else if (cmd instanceof SubCommand) {
			this.base = cmd.base;
		}
	}

	public getBase(): BaseCommand | undefined {
		return this.base;
	}

	public noArgsFallback(ctx: Context): void {
		ctx.send(BuildEmbed.command(ctx, this));
	}
}
