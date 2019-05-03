import { Collection } from 'discord.js';
import { CommandOptions } from 'typings';
import { Command } from 'typings';

function validateCommandOptions(options: any): CommandOptions {
  if (!options) throw new Error('Invalid CommandOptions provided!');
  if (!options.name) throw new Error('Invalid command name provided!');
  if (!options.description) options.description = 'No description provided';
  return options;
}

export abstract class AbstractCommand {
  public subcommands?: Collection<string, Command>;
  public readonly name: string;
  public readonly description: string;
  public readonly usage?: string;

  constructor(options: CommandOptions) {
    options = validateCommandOptions(options);
    this.name = options.name;
    this.description = options.description;
    this.usage = options.usage;
  }

  // By default, throws an invalid args error
  // which will show a help message in chat.
  public async execute(): Promise<void> {
    throw 200;
  }

  // Clunky bit of code, but couldn't think of any other way
  // to do this because of circular dependencies
  public registerSubCommands(...subCmds: Array<Command>): Command {
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
