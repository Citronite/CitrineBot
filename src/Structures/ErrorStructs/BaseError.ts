import { RichEmbed } from 'discord.js';
import { QuickEmbed } from '../../Utils/QuickEmbed';
import { ErrorCodes } from './ErrorCodes';
import { ExceptionParser } from './ExceptionParser';

export class BaseError extends Error {
	public readonly code: number;
	public readonly type: string;
	public readonly name: string;
	public readonly errors: string[];
	public readonly message: string;

	constructor(code: number, errors: string[]) {
		super();
		this.code = Object.values(ErrorCodes).includes(code) ? code : 999;
		this.type = Object.keys(ErrorCodes).find(val => ErrorCodes[val] === code) || 'UNKNOWN_ERROR';
		this.name = `${this.type}:${this.code}`;
		this.errors = errors || ExceptionParser.getDefaultMessages()[this.code];
		this.message = `Error(s):\n\t${errors.join('\n')}`;
	}

	public toString(): string {
		const top = `⛔ ${this.name} ⛔`;
		const msg = this.message;
		return `\`\`\`\n${top}\n\n${msg}\n\`\`\``;
	}

	public toEmbed(): RichEmbed {
		return QuickEmbed.error(this.message, this.type).setTitle('Exception Occurred!');
	}
}
