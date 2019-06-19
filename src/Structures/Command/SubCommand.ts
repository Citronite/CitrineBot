import { Command } from './AbstractCommand';
import { CommandOptions } from 'typings';

export class SubCommand extends Command {
  public readonly id: 'sub';
  public parent?: Command;

  public constructor(options: CommandOptions) {
    super(options);
    this.id = 'sub';
  }

  public setParent(cmd: Command): void {
    if (cmd instanceof Command) {
      this.parent = cmd;
    } else {
      throw new Error(
        'Parent commands must be instances of BaseCommand or SubCommand!'
      );
    }
  }
}
