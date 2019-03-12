import { Command } from 'typings';

export enum ErrorTypes {
	MISSING_BOT_PERMS = 101,
	MISSING_MEMBER_PERMS = 102,
	FAILED_CUSTOM_FILTERS = 103,
	INSUFFICIENT_ARGS = 200,
	UNKNOWN = 666
}

export class CommandError extends Error {
	public readonly cmd: Command;
	public readonly type: number;
	public readonly errors: string[];
	constructor(cmd: Command, errorType: number, errors: string[]) {
		super();
		this.cmd = cmd;
		this.type = errorType;
		this.errors = errors;
	}
}
