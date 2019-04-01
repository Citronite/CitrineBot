import { Collection } from 'discord.js';
import { CommandOptions } from 'typings';
import { Context } from '../../Utils/Context';

// Hacky fix for circular dependencies. :(
export type Command = AbstractCommand | any;

// type tCommand = SubCommand | BaseCommand | AbstractCommand;
type tClass = (new(...args: any[]) => any);

export abstract class AbstractCommand {
  public subcommands?: Collection<string, Command>;
  public readonly name: string;
  public readonly description: string;
  public readonly usage: string;

  constructor(name: string, options: CommandOptions) {
    this.name = name;
    this.description = options.description || 'No description provided';
    this.usage = options.usage || '';
  }

  public async execute(ctx: Context, ...args: any[]): Promise<void> {
    return;
  }

  public registerSubCommands(...subCmds: Array<tClass>): Command {
    this.subcommands = new Collection();
    for (const subCmd of subCmds) {
      const instance = new subCmd();

      // Hacky check for whether its a subcommand or not.
      // Couldn't use instanceof SubCommand because of circular dependency.
      if (instance.getParent) {
        this.subcommands.set(instance.name, instance);
        continue;
      }
      throw new Error('Only instances of the SubCommand class can be registered!');
    }
    return this;
  }
}
