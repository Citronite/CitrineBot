import { AbstractCommand } from './AbstractCommand';
import { CommandOptions } from 'typings';

export class BaseCommand extends AbstractCommand {
  public readonly chip: string;

  constructor(name: string, options: CommandOptions) {
    super(name, options);

    this.chip = __filename;
  }
}
