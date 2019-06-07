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
  public readonly name: string;
  public readonly description: string;
  public readonly usage?: string;

  constructor(options: CommandOptions) {
    validateCommandOptions(options);
    this.name = options.name;
    this.description = options.description;
    this.usage = options.usage;
  }

  // By default, throws an INSUFFICIENT_ARGS error,
  // which will show a help message in discord.
  public async execute(ctx: Context, ...args: any[]): Promise<void> {
    if (ctx.subcommand) return;
    throw 201;
  }

  // Couldn't think of any better way
  // to do this. I'm not smart enough.
  public registerSubCommands(...subCmds: Array<any>) {
    this.subcommands = new Collection();
    for (const subCmd of subCmds) {
      if (subCmd.setParent && subCmd.setBase) {
        subCmd.setParent(this);
        subCmd.setBase(this);
        this.subcommands.set(subCmd.name, subCmd);
        continue;
      } else {
        throw new Error('Only instances of the SubCommand class can be registered!');
      }
    }
    return this;
  }
}
