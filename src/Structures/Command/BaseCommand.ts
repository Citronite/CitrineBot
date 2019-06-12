import { Command } from './AbstractCommand';
import { CommandOptions } from 'typings';
// const chipName = () => __dirname.split(sep).slice(-1)[0];

export class BaseCommand extends Command {
  public readonly chip: string;

  public constructor(options: CommandOptions) {
    if (!options.chip) throw Error('Please provide the chip name!');
    super(options);
    this.chip = options.chip;
  }
}
