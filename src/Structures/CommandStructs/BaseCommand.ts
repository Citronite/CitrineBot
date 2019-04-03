import { AbstractCommand } from './AbstractCommand';
import { CommandOptions } from 'typings';
// import { sep } from 'path';

// Use this for chipName:
// const chipName = () => __dirname.split(sep).slice(-1)[0];

export class BaseCommand extends AbstractCommand {
  public readonly chip: string;

  constructor(name: string, chip: string, options: CommandOptions) {
    if (typeof name !== 'string') throw Error('Command name must be a string!');
    if (typeof chip !== 'string') throw Error('Command chip must be a string!');
    if (typeof options !== 'object') throw Error('Command options must be an object!');

    super(name, options);
    this.chip = chip;
  }
}
