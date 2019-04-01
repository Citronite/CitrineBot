import { AbstractCommand } from './AbstractCommand';
import { CommandOptions } from 'typings';

export class BaseCommand extends AbstractCommand {
  public readonly chip: string;

  constructor(name: string, chip: string, options: CommandOptions) {
    super(name, options);

    this.chip = chip;
  }
}
