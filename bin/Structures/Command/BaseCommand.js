"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const SubCommand_1 = __importDefault(require("./SubCommand"));
function validateOptions(options) {
    if (!options)
        throw new Error('Invalid CommandOptions provided!');
    if (!options.name)
        throw new Error('Invalid command name provided!');
    if (!options.description)
        throw new Error('No description provided!');
    if (!options.chip)
        throw new Error('Invalid chip name provided!');
}
function setParent(child, parent) {
    if (parent.id === 'base' || parent.id === 'sub') {
        child.parent = parent;
    }
    else {
        throw new Error('Parent commands must be instances of BaseCommand or SubCommand!');
    }
}
class BaseCommand {
    constructor(options) {
        validateOptions(options);
        this.name = options.name;
        this.description = options.description;
        this.usage = options.usage;
        this.chip = options.chip;
        this.id = 'base';
    }
    async execute(ctx, ...args) {
        if (ctx.subcommand)
            return;
        if (args.length)
            throw 'INVALID_ARGS';
        else
            throw 'INSUFFICIENT_ARGS';
    }
    register(...subCmds) {
        this.subcommands = new discord_js_1.Collection();
        for (const subCmd of subCmds) {
            if (subCmd instanceof SubCommand_1.default) {
                setParent(subCmd, this);
                this.subcommands.set(subCmd.name, subCmd);
                continue;
            }
            else {
                throw new Error('Only instances of the SubCommand class can be registered!');
            }
        }
        return this;
    }
}
exports.default = BaseCommand;
