import { RichEmbed } from 'discord.js';
import { QuickEmbed } from '../../Utils/QuickEmbed';
import { ExceptionCodes } from './ExceptionCodes';
import { ExceptionMessages } from './ExceptionMessages';

export class Exception extends Error {
  public readonly code: number;
  public readonly type: string;
  public readonly errors: string[];

  constructor(code: number, errors: string | string[], original?: Error) {
    super();
    if (original) this.stack = original.stack;
    this.code = Object.values(ExceptionCodes).includes(code) ? code : 999;
    this.type = Object.keys(ExceptionCodes).find(val => ExceptionCodes[val] === code) || 'UNKNOWN_ERROR';
    errors = typeof errors === 'string' ? [errors] : errors;
    this.errors = errors || ExceptionMessages[this.code];
  }

  get name(): string {
    return `${this.type}:${this.code}`;
  }

  get info(): string {
    return this.errors.join('\n');
  }

  public toString(code: boolean = true): string {
    const top = `\⛔ ${this.name} \⛔`;
    const msg = this.info;
    return code ? `\`\`\`\n${top}\n\n${msg}\n\`\`\`` : `${top}\n\n${msg}`;
  }

  public toEmbed(): RichEmbed {
    return QuickEmbed.error(this.info)
      .setTitle('Exception Occurred!')
      .setFooter(`\⛔ ${this.name}`);
  }

  public static parse(err: string | number | Exception | Error): Exception {
    if (err instanceof Exception) {
      return err;
    }
    if (err instanceof Error) {
      return new Exception(999, err.message, err);
    }
    if (typeof err === 'string') {
      const code = ExceptionCodes[err] || 999;
      const errMsg = ExceptionMessages[code];
      return new Exception(code, errMsg);
    }
    if (typeof err === 'number') {
      const code = Object.values(ExceptionCodes).includes(err) ? err : 999;
      const errMsg = ExceptionMessages[code];
      return new Exception(code, errMsg);
    }
    return new Exception(999, ExceptionMessages[999]);
  }
}
