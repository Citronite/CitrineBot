import { Command } from './AbstractCommand';
import { CommandOptions } from 'typings';
// const chipName = () => __dirname.split(sep).slice(-1)[0];

export class BaseCommand extends Command {
  public readonly chip: string;

  constructor(options: CommandOptions) {
    if (!options.chip) throw Error('Please provide the chip name!');
    if (typeof options.chip !== 'string') throw Error('Invalid chip name provided!');
    super(options);
    this.chip = options.chip;
  }
}
