import { Collection } from 'discord.js';
import { CommandOptions } from 'typings';
import { Context } from '../../Utils/Context';

function validateCommandOptions(options: any): void {
  if (!options) throw new Error('Invalid CommandOptions provided!');
  if (!options.name) throw new Error('Invalid command name provided!');
  if (!options.description) throw new Error('No description provided!');
}

export abstract class Command {
  public subcommands?: Collection<string, Command>;
  public parent?: Command;
  public readonly name: string;
  public readonly description: string;
  public readonly usage?: string;

  public constructor(options: CommandOptions) {
    validateCommandOptions(options);
    this.name = options.name;
    this.description = options.description;
    this.usage = options.usage;
  }

  // By default, throws an INSUFFICIENT_ARGS error,
  // which will show a help message in discord.
  public async execute(ctx: Context, ...args: string[]): Promise<void> {
    if (ctx.subcommand) return;
    if (args.length) throw 'INVALID_ARGS';
    else throw 'INSUFFICIENT_ARGS';
  }

  public getParent(): Command | null {
    return this.parent || null;
  }

  public getBase(): Command {
    let base: Command = this;
    while (base.parent) {
      base = base.parent;
    }
    return base;
  }

  public registerSubCommands(...subCmds: any[]): this {
    this.subcommands = new Collection();
    for (const subCmd of subCmds) {
      if (subCmd.id === 'sub' && subCmd.setParent) {
        subCmd.setParent(this);
        this.subcommands.set(subCmd.name, subCmd);
        continue;
      } else {
        throw new Error(
          'Only instances of the SubCommand class can be registered!'
        );
      }
    }
    return this;
  }
}
