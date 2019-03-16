import { RichEmbed } from 'discord.js';
import { Embed } from '../../Utils/Embeds';
import { ErrorCodes } from './ErrorCodes';

export class CommonError extends Error {
	public readonly code: number;
	public readonly type: string;
	public readonly name: string;
	public readonly errors: string[];
	public readonly message: string;
	constructor(code: number, errors: string[]) {
		super();
		this.code = code;
		this.type = ErrorCodes[code];
		this.name = `${this.type}:${this.code}`;
		this.errors = errors;
		this.message = `Error(s):\n\t${errors.join('\n')}`;
	}

	public toString(): string {
		const top = `⛔ **${this.name}:${this.code}** ⛔`;
		const msg = this.message;
		return `${top}\n\n${msg}`;
	}

	public toEmbed(): RichEmbed {
		return Embed.error(this.message, this.type).setTitle('Exception Occurred!');
	}
}
