import { Collection } from 'discord.js';
import { SubCommandOptions } from 'typings';
import { Context } from '../Utils/Context';
import { BaseCommand } from './BaseCommand';

type Command = SubCommand | BaseCommand;

function validateOptions(options: any): void {
  if (!options) throw new Error('Invalid CommandOptions provided!');
  if (!options.name) throw new Error('Invalid command name provided!');
  if (!options.description) throw new Error('No description provided!');
}

function setParent(child: SubCommand, parent: Command): void {
  if (parent.id === 'base' || parent.id === 'sub') {
    child.parent = parent;
  } else {
    throw new Error(
      'Parent commands must be instances of BaseCommand or SubCommand!'
    );
  }
}

export class SubCommand {
  public readonly id: 'sub';
  public readonly name: string;
  public readonly description: string;
  public readonly usage?: string;
  public parent?: Command;
  public subcommands?: Collection<string, SubCommand>;

  public constructor(options: SubCommandOptions) {
    validateOptions(options);
    this.name = options.name;
    this.description = options.description;
    this.usage = options.usage;
    this.id = 'sub';
  }

  public async execute(ctx: Context, ...args: string[]): Promise<void> {
    if (ctx.subcommand) return;
    if (args.length) throw 'INVALID_ARGS';
    else throw 'INSUFFICIENT_ARGS';
  }

  public getParent(): Command | undefined {
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
        setParent(subCmd, this);
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
