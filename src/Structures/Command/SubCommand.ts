import { Collection } from 'discord.js';
import { SubCommandOptions } from 'typings';
import Context from '../Utils/Context';
import BaseCommand from './BaseCommand';

function validateOptions(options: any): void {
  if (!options) throw new Error('Invalid CommandOptions provided!');
  if (!options.name) throw new Error('Invalid command name provided!');
  if (!options.description) throw new Error('No description provided!');
}

export default class SubCommand {
  public readonly name: string;
  public readonly description: string;
  public readonly usage?: string;
  public parent?: SubCommand | BaseCommand;
  public subcommands?: Collection<string, SubCommand>;

  public constructor(options: SubCommandOptions) {
    validateOptions(options);
    this.name = options.name;
    this.description = options.description;
    this.usage = options.usage;
  }

  public async execute(ctx: Context, ...args: string[]): Promise<void> {
    if (ctx.subcommand) return;
    if (args.length) throw 'INVALID_ARGS';
    else throw 'INSUFFICIENT_ARGS';
  }

  public getParent(): SubCommand | BaseCommand | undefined {
    return this.parent;
  }

  public getBase(): BaseCommand | undefined {
    let cmd: any = this;
    while (cmd.parent) {
      cmd = cmd.parent;
    }
    return cmd.id === 'base' ? cmd : undefined;
  }

  public register(...subCmds: any[]): this {
    this.subcommands = new Collection();
    for (const subCmd of subCmds) {
      if (subCmd instanceof SubCommand) {
        subCmd.parent = this;
        this.subcommands.set(subCmd.name, subCmd);
        continue;
      } else {
        throw new Error('Only instances of the SubCommand class can be registered!');
      }
    }
    return this;
  }
}
