"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const BaseCommand_1 = __importDefault(require("./BaseCommand"));
function validateOptions(options) {
    if (!options)
        throw new Error('Invalid CommandOptions provided!');
    if (!options.name)
        throw new Error('Invalid command name provided!');
    if (!options.description)
        throw new Error('No description provided!');
}
class SubCommand {
    constructor(options) {
        validateOptions(options);
        this.name = options.name;
        this.description = options.description;
        this.usage = options.usage;
    }
    async execute(ctx, ...args) {
        if (ctx.subcommand)
            return;
        if (args.length)
            throw 'INVALID_ARGS';
        else
            throw 'INSUFFICIENT_ARGS';
    }
    getParent() {
        return this.parent;
    }
    getBase() {
        let cmd = this;
        while (cmd instanceof SubCommand) {
            cmd = cmd.parent;
        }
        return cmd instanceof BaseCommand_1.default ? cmd : undefined;
    }
    register(...subCmds) {
        this.subcommands = new discord_js_1.Collection();
        for (const subCmd of subCmds) {
            if (subCmd instanceof SubCommand) {
                subCmd.parent = this;
                this.subcommands.set(subCmd.name, subCmd);
            }
            else {
                throw new Error('Only instances of the SubCommand class can be registered!');
            }
        }
        return this;
    }
}
exports.default = SubCommand;
