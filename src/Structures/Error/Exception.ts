import { RichEmbed } from 'discord.js';
import { QuickEmbed } from '../../Utils/QuickEmbed';
import { ExceptionCodes } from './ExceptionCodes';
import { ExceptionMessages } from './ExceptionMessages';
import { RawException, RawExceptionArray } from 'typings';

// Type guard
function isExceptionArray(err: any): err is RawExceptionArray {
  const isArr = err.constructor.name === 'Array';
  const hasType = ['string', 'number'].includes(typeof err[0]);
  const hasMsg = typeof(err[1]) === 'string' || typeof(err[1][0]) === 'string';
  return isArr && hasType && hasMsg;
}

/*
// Type guard
function isExceptionObject(err: any): err is RawExceptionObject {
  const isObj = err.constructor.name === 'Object';
  const hasType = ['string', 'number'].includes(typeof err.type);
  const hasMsg = typeof err.msg === 'string' || typeof err.msg[0] === 'string';
  return isObj && hasType && hasMsg;
}
*/

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
      .setFooter(`⛔ ${this.name}`);
  }

  public static resolveCode(err: any): number {
    if (typeof err === 'string') {
      return ExceptionCodes[err] || ExceptionCodes.UNKNOWN_ERROR;
    } else if (typeof err === 'number') {
      return Object.values(ExceptionCodes).includes(err) ? err : ExceptionCodes.UNKNOWN_ERROR;
    } else {
      return 999;
    }
  }

  public static resolveDefaultMessage(err: any): string {
    const code = this.resolveCode(err);
    return ExceptionMessages[code];
  }

  public static parse(err: RawException | Exception): Exception {
    if (err instanceof Exception) return err;

    if (err instanceof Error) {
      return new Exception(999, err.message, err);
    }

    if (typeof err === 'string' || typeof err === 'number') {
      const code = this.resolveCode(err);
      const msg = this.resolveDefaultMessage(code);
      return new Exception(code, msg);
    }

    if (isExceptionArray(err)) {
      const code = this.resolveCode(err[0]);
      return new Exception(code, err[1]);
    }

    /*
    if (isExceptionObject(err)) {
      const code = this.resolveCode(err.type);
      return new Exception(code, err.msg);
    }
    */

    return new Exception(999, ExceptionMessages[999]);
  }
}
