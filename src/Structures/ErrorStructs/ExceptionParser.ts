import { BaseError } from './BaseError';
import { CommandError } from './CommandError';
import { ErrorCodes } from './ErrorCodes';
import { Command } from '../CommandStructs/AbstractCommand';
import { ErrorMessages } from './ErrorMessages';

type Exception = number | string | CommandError | BaseError | Error;

export class ExceptionParser {
  constructor() {
    throw new Error('This class may not be instantiated with the new keyword!');
  }

  public static parse(err: Exception, cmd?: Command): CommandError | BaseError {
    if (err instanceof BaseError) {
      return cmd ? new CommandError(cmd, err.code, err.errors) : err;
    } else {
      let parsedError: CommandError | BaseError;

      if (typeof err === 'string') {
        const code = ErrorCodes[err] || 999;
        const msg = ErrorMessages[code];
        parsedError = new BaseError(code, msg);
      } else if (typeof err === 'number') {
        const code = Object.values(ErrorCodes).includes(err) ? err : 999;
        const msg = ErrorMessages[code];
        parsedError = new BaseError(code, msg);
      } else {
        parsedError = new BaseError(999, err.message);
      }

      if (cmd) {
        parsedError = new CommandError(cmd, parsedError.code, parsedError.errors);
      }

      return parsedError;
    }
  }
}
