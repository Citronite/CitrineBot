import { Command } from 'typings';
import { CommonError } from './CommonError';

export class CommandError extends CommonError {
	public readonly cmd: Command;
	constructor(cmd: Command, code: number, errors: string[]) {
		super(code, errors);
		this.cmd = cmd;
	}
}
