import { BaseError } from './BaseError';
import { CommandError } from './CommandError';
import { ErrorCodes } from './ErrorCodes';
import { Command } from '../CommandStructs/AbstractCommand';

type Exception = number | string | CommandError | BaseError;

export class ExceptionParser {
	constructor() {
		throw new Error('This class may not be instantiated with new!');
	}

	public static parse(err: Exception, cmd?: Command): CommandError | BaseError {
		if (err instanceof BaseError) {

			return cmd ? new CommandError(cmd, err.code, err.errors) : err;
		} else {
			let parsedError: CommandError | BaseError;
			const defaults = this.getDefaultMessages();

			if (typeof err === 'string') {
				const code = ErrorCodes[err] || 999;
				const msg = defaults[code];
				parsedError = new BaseError(code, msg);
			} else if (typeof err === 'number') {
				const code = Object.values(ErrorCodes).includes(err) ? err : 999;
				const msg = defaults[code];
				parsedError = new BaseError(code, msg);
			} else {
				parsedError = new BaseError(999, defaults[999]);
			}

			if (cmd) {
				parsedError = new CommandError(cmd, parsedError.code, parsedError.errors);
			}

			return parsedError;
		}
	}

	public static getDefaultMessages(): {[key in number]: string[]} {
		return {
			100: ['Insufficient permissions!'],
			101: ['Are you sure you have the proper permissions to invoke this command?'],
			102: ['Are you sure I have the proper permissions to execute this command?'],
			103: ['You failed to pass through Citrine\'s custom filters!'],
			200: ['Insufficient / Invalid arguments provided!'],
			201: ['Insufficient arguments provided! You can use the help command to view command usage!'],
			202: ['Invalid arguments provided! You can use the help command to view command usage!'],
			404: ['Is this what amnesia feels like?'],
			999: ['Whoops! Something went wrong and I have no idea what it is. I\'m sorry! :C']
		};
	}
}
