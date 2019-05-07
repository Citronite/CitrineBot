import { Command } from './AbstractCommand';
import { BaseCommand } from './BaseCommand';
import { CommandOptions } from 'typings';

export class SubCommand extends Command {
  private parent?: Command;
  private base?: BaseCommand;

  constructor(options: CommandOptions) {
    super(options);
  }

  public setParent(cmd: Command): void {
    if (this.parent) throw new Error('Parent commands cannot be reset!');
    if (cmd instanceof BaseCommand || cmd instanceof SubCommand) {
      this.parent = cmd;
    } else {
      throw new Error('Parent commands must be instances of BaseCommand or SubCommand!');
    }
  }

  public getParent(): Command | false {
    return this.parent || false;
  }

  public setBase(cmd: Command): void {
    if (this.base) throw new Error('Base commands cannot be reset!');
    if (cmd instanceof BaseCommand) {
      this.base = cmd;
    }	else if (cmd instanceof SubCommand) {
      this.base = cmd.base;
    } else {
      throw new Error('Base commands must be instance of BaseCommand!');
    }
  }

  public getBase(): BaseCommand | false {
    return this.base || false;
  }
}
