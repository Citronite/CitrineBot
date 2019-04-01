import { AbstractCommand } from './AbstractCommand';
import { CommandOptions } from 'typings';
import { sep } from 'path';

// Use this for chipName:
// const chipName = () => __dirname.split(sep).slice(-1)[0];

export class BaseCommand extends AbstractCommand {
  public readonly chip: string;

  constructor(name: string, chip: string, options: CommandOptions) {
    super(name, options);

    this.chip = chip || '--/--';
  }
}
