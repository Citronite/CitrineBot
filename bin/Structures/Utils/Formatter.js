"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCommand_1 = __importDefault(require("../Command/BaseCommand"));
class Formatter {
    italic(str) {
        if (typeof str === 'string') {
            return `*${str}*`;
        }
        else {
            return str.map(val => `*${val}*`);
        }
    }
    lined(str) {
        if (typeof str === 'string') {
            return `__${str}__`;
        }
        else {
            return str.map(val => `__${val}__`);
        }
    }
    striked(str) {
        if (typeof str === 'string') {
            return `~~${str}~~`;
        }
        else {
            return str.map(val => `~~${val}~~`);
        }
    }
    bold(str) {
        if (typeof str === 'string') {
            return `**${str}**`;
        }
        else {
            return str.map(val => `**${val}**`);
        }
    }
    inline(str) {
        if (typeof str === 'string') {
            return `\`${str}\``;
        }
        else {
            return str.map(val => `\`${val}\``);
        }
    }
    block(str, lang = '') {
        if (typeof str === 'string') {
            return `\`\`\`${lang}\n${str}\`\`\``;
        }
        else {
            return str.map(val => `\`\`\`${lang}\n${val}\`\`\``);
        }
    }
    censor(text, ...words) {
        for (const word of words) {
            text = text.replace(word, '<CENSORED>');
        }
        return text;
    }
    cmdHelp(cmd, options) {
        let chip, parent, base, usage, subcommands;
        const name = cmd.name;
        const description = cmd.description;
        const maxWidth = (options && options.maxWidth) || 50;
        const useCodeBlocks = (options && options.useCodeBlocks) || true;
        if (cmd instanceof BaseCommand_1.default) {
            chip = cmd.chip;
            base = parent = '--/--';
        }
        else {
            const parentCmd = cmd.getParent();
            const baseCmd = cmd.getBase();
            chip = baseCmd ? baseCmd.chip : '--/--';
            parent = parentCmd ? parentCmd.name : '--/--';
            base = baseCmd ? baseCmd.name : '--/--';
        }
        if (cmd.usage)
            usage = useCodeBlocks ? `\`\`\`\n${cmd.usage}\n\`\`\`` : cmd.usage;
        if (cmd.subcommands) {
            const names = [];
            const descrips = [];
            const final = [];
            for (const [key, val] of cmd.subcommands) {
                names.push(key);
                descrips.push(val.description);
            }
            const max = names.reduce((acc, cur) => (acc > cur.length ? acc : cur.length), 0);
            for (let x = 0; x < names.length; x++) {
                const paddedName = names[x].padEnd(max + 2);
                const sliceLength = maxWidth - (max + 2) - 3;
                const slicedDescrip = descrips[x].length >= sliceLength
                    ? `${descrips[x].slice(0, sliceLength)}...`
                    : descrips[x];
                const str = paddedName + slicedDescrip;
                final.push(str);
            }
            subcommands = useCodeBlocks ? `\`\`\`\n${final.join('\n')}\n\`\`\`` : final.join('\n');
        }
        return {
            name,
            description,
            chip,
            parent,
            base,
            usage,
            subcommands
        };
    }
}
exports.default = Formatter;
