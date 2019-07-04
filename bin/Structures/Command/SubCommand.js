"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
function validateOptions(options) {
    if (!options)
        throw new Error('Invalid CommandOptions provided!');
    if (!options.name)
        throw new Error('Invalid command name provided!');
    if (!options.description)
        throw new Error('No description provided!');
}
function setParent(child, parent) {
    if (parent.id === 'base' || parent.id === 'sub') {
        child.parent = parent;
    }
    else {
        throw new Error('Parent commands must be instances of BaseCommand or SubCommand!');
    }
}
class SubCommand {
    constructor(options) {
        validateOptions(options);
        this.name = options.name;
        this.description = options.description;
        this.usage = options.usage;
        this.id = 'sub';
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
        while (cmd.parent) {
            cmd = cmd.parent;
        }
        return cmd.id === 'base' ? cmd : undefined;
    }
    register(...subCmds) {
        this.subcommands = new discord_js_1.Collection();
        for (const subCmd of subCmds) {
            if (subCmd instanceof SubCommand) {
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
exports.default = SubCommand;
