import { Command } from './AbstractCommand';
import { CommandOptions } from 'typings';
// const chipName = () => __dirname.split(sep).slice(-1)[0];

export class BaseCommand extends Command {
  public readonly chip: string;
  public readonly id: 'base';

  public constructor(options: CommandOptions) {
    super(options);
    if (!options.chip) throw new Error('Invalid chip name provided!');
    this.chip = options.chip;
    this.id = 'base';
  }
}
