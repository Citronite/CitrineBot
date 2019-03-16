import { AbstractCommand } from './AbstractCommand';
import { CommandOptions } from 'typings';
import { BuildEmbed } from '../../Utils/BuildEmbed';
import { Context } from '../../Utils/Context';

export class BaseCommand extends AbstractCommand {
	public readonly module: string;

	constructor(name: string, module: string, options: CommandOptions) {
		super(name, options);

		this.module = module;
	}

	public noArgsFallback(ctx: Context): void {
		ctx.send(BuildEmbed.command(ctx, this));
	}
}
