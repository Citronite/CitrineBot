import { RichEmbed } from 'discord.js';
import { QuickEmbed } from '../../Utils/QuickEmbed';
import { ErrorCodes } from './ExceptionCodes';
import { ErrorMessages } from './ExceptionMessages';
import { Command } from '../CommandStructs/AbstractCommand';

export class Exception extends Error {
  public readonly code: number;
  public readonly type: string;
  public readonly cmd?: Command;
  public readonly errors: string[];
  public readonly name: string;
  public readonly info: string;

  constructor(code: number, errors: string | string[]) {
    super();
    this.code = Object.values(ErrorCodes).includes(code) ? code : 999;
    this.type = Object.keys(ErrorCodes).find(val => ErrorCodes[val] === code) || 'UNKNOWN_ERROR';

    errors = typeof errors === 'string' ? [errors] : errors;
    this.errors = errors || ErrorMessages[this.code];
    this.name = `${this.type}:${this.code}`;
    this.info = `Error(s):\n\t${this.errors.join('\n')}`;
  }

  public toString(code: boolean = true): string {
    const top = `⛔ ${this.name} ⛔`;
    const msg = this.message;
    return code ? `\`\`\`\n${top}\n\n${msg}\n\`\`\`` : `${top}\n\n${msg}`;
  }

  public toEmbed(): RichEmbed {
    return QuickEmbed.error(this.message)
      .setTitle('⛔ Exception Occurred!')
      .setFooter(`Error: ${this.name}`);
  }

  public static parse(err: string | number | Exception | Error): Exception {
    if (typeof err === 'string') {
      const code = ErrorCodes[err] || 999;
      const errMsg = ErrorMessages[code];
      return new Exception(code, errMsg);
    }
    if (typeof err === 'number') {
      const code = Object.values(ErrorCodes).includes(err) ? err : 999;
      const errMsg = ErrorMessages[code];
      return new Exception(code, errMsg);
    }
    return new Exception(999, err.message);
  }
}
