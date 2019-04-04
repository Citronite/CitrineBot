import { AbstractCommand, Command } from './AbstractCommand';
import { BaseCommand } from './BaseCommand';
import { CommandOptions } from 'typings';

export class SubCommand extends AbstractCommand {
  private parent?: Command;
  private base?: BaseCommand;

  constructor(options: CommandOptions) {
    super(options);
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
}
