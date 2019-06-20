import { BaseCommandOptions } from 'typings';
import { Collection } from 'discord.js';
import Context from '../Utils/Context';
import SubCommand from './SubCommand';

type Command = SubCommand | BaseCommand;

function validateOptions(options: any): void {
  if (!options) throw new Error('Invalid CommandOptions provided!');
  if (!options.name) throw new Error('Invalid command name provided!');
  if (!options.description) throw new Error('No description provided!');
  if (!options.chip) throw new Error('Invalid chip name provided!');
}

function setParent(child: SubCommand, parent: Command): void {
  if (parent.id === 'base' || parent.id === 'sub') {
    child.parent = parent;
  } else {
    throw new Error('Parent commands must be instances of BaseCommand or SubCommand!');
  }
}

export default class BaseCommand {
  public readonly id: 'base';
  public readonly name: string;
  public readonly description: string;
  public readonly usage?: string;
  public readonly chip: string;
  public subcommands?: Collection<string, SubCommand>;

  public constructor(options: BaseCommandOptions) {
    validateOptions(options);
    this.name = options.name;
    this.description = options.description;
    this.usage = options.usage;
    this.chip = options.chip;
    this.id = 'base';
  }

  public async execute(ctx: Context, ...args: string[]): Promise<void> {
    if (ctx.subcommand) return;
    if (args.length) throw 'INVALID_ARGS';
    else throw 'INSUFFICIENT_ARGS';
  }

  public register(...subCmds: any[]): this {
    this.subcommands = new Collection();
    for (const subCmd of subCmds) {
      if (subCmd instanceof SubCommand) {
        setParent(subCmd, this);
        this.subcommands.set(subCmd.name, subCmd);
        continue;
      } else {
        throw new Error('Only instances of the SubCommand class can be registered!');
      }
    }
    return this;
  }
}
