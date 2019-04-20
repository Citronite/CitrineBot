import { Collection } from 'discord.js';
import { CommandOptions } from 'typings';

// Hacky fix for circular dependencies. :(
export type Command = AbstractCommand | any;

// type tCommand = SubCommand | BaseCommand | AbstractCommand;
type tClass = (new(...args: any[]) => any);

export abstract class AbstractCommand {
  public subcommands?: Collection<string, Command>;
  public readonly name: string;
  public readonly description: string;
  public readonly usage?: string;

  constructor(options: CommandOptions) {
    if (!options) throw new Error('Invalid CommandOptions provided!');
    this.name = options.name;
    if (!this.name) throw new Error('Invalid command name provided!');
    this.description = options.description || 'No description provided';
    this.usage = options.usage || undefined;
  }

  // By default, throws an invalid args error
  // which will show a help message in chat
  public async execute(): Promise<void> {
    throw 200;
  }

  public registerSubCommands(...subCmds: Array<Command>): Command {
    this.subcommands = new Collection();
    for (const subCmd of subCmds) {
      // Hacky check for whether its a subcommand or not.
      // Couldn't use instanceof SubCommand because of circular dependency.
      if (subCmd.setParent && subCmd.setBase) {
        subCmd.setParent(this);
        subCmd.setBase(this);
        this.subcommands.set(subCmd.name, subCmd);
        continue;
      }
      throw new Error('Only instances of the SubCommand class can be registered!');
    }
    return this;
  }
}
