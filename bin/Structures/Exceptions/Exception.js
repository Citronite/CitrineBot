"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const QuickEmbed_1 = __importDefault(require("../Utils/QuickEmbed"));
const ExceptionCodes_1 = __importDefault(require("./ExceptionCodes"));
const ExceptionMessages_1 = __importDefault(require("./ExceptionMessages"));
// Type guard
function isExceptionArray(err) {
    const isArr = err.constructor.name === 'Array';
    const hasType = ['string', 'number'].includes(typeof err[0]);
    const hasMsg = typeof err[1] === 'string' || typeof err[1][0] === 'string';
    return isArr && hasType && hasMsg;
}
class Exception extends Error {
    constructor(code, errors, original) {
        super();
        if (original)
            this.stack = original.stack;
        this.code = Object.values(ExceptionCodes_1.default).includes(code) ? code : 999;
        this.type =
            Object.keys(ExceptionCodes_1.default).find(val => ExceptionCodes_1.default[val] === code) || 'UNKNOWN_ERROR';
        errors = typeof errors === 'string' ? [errors] : errors;
        this.errors = errors || ExceptionMessages_1.default[this.code];
    }
    get name() {
        return `${this.type}:${this.code}`;
    }
    get info() {
        return this.errors.join('\n');
    }
    toString(code = true) {
        const top = `⛔ ${this.name} ⛔`;
        const msg = this.info;
        return code ? `\`\`\`\n${top}\n\n${msg}\n\`\`\`` : `${top}\n\n${msg}`;
    }
    toEmbed() {
        return QuickEmbed_1.default.error(this.info)
            .setTitle('Exception')
            .setFooter(`⛔ ${this.name}`);
    }
    static resolveCode(err) {
        if (typeof err === 'string') {
            return ExceptionCodes_1.default[err] || ExceptionCodes_1.default.UNKNOWN_ERROR;
        }
        else if (typeof err === 'number') {
            return Object.values(ExceptionCodes_1.default).includes(err) ? err : ExceptionCodes_1.default.UNKNOWN_ERROR;
        }
        else {
            return 999;
        }
    }
    static resolveDefaultMessage(err) {
        const code = this.resolveCode(err);
        return ExceptionMessages_1.default[code];
    }
    static parse(err) {
        if (err instanceof Exception)
            return err;
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
        return new Exception(999, ExceptionMessages_1.default[999]);
    }
}
exports.default = Exception;
