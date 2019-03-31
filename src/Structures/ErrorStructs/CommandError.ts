import { Command } from '../CommandStructs/AbstractCommand';
import { BaseError } from './BaseError';

export class CommandError extends BaseError {
  public readonly cmd: Command;
  constructor(cmd: Command, code: number, errors: string[]) {
    super(code, errors);
    this.cmd = cmd;
  }
}
