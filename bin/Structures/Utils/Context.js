"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const QuickEmbed_1 = __importDefault(require("./QuickEmbed"));
const Exception_1 = __importDefault(require("../Exceptions/Exception"));
const ExceptionMessages_1 = __importDefault(require("../Exceptions/ExceptionMessages"));
const discord_js_1 = require("discord.js");
function validateContextData(data) {
    if (!data)
        throw new Error('ContextData is required!');
    if (!data.message)
        throw new Error('ContextData#message is required!');
    if (!data.prefix)
        throw new Error('ContextData#prefix is required!');
    if (!data.command)
        throw new Error('ContextData#cmd is required!');
}
class Context {
    constructor(data) {
        validateContextData(data);
        const message = data.message;
        const subcmd = data.subcommand;
        this.client = message.client;
        this.message = message;
        this.author = message.author;
        this.channel = message.channel;
        this.member = message.member || null;
        this.guild = message.guild || null;
        this.prefix = data.prefix;
        this.command = data.command;
        this.subcommand = subcmd;
    }
    async send(...args) {
        return this.channel.send(...args);
    }
    async sendDM(...args) {
        try {
            const res = await this.author.send(...args);
            return res;
        }
        catch (_) {
            return this.channel.send('Failed to send DM. Please make sure your DMs are enabled.');
        }
    }
    async success(msg, embed = true) {
        if (embed) {
            const embed = QuickEmbed_1.default.success(msg);
            return this.channel.send(embed);
        }
        else {
            return this.channel.send(`✅ ${msg}`);
        }
    }
    async error(msg, embed = true) {
        if (embed) {
            const embed = QuickEmbed_1.default.error(msg);
            return this.channel.send(embed);
        }
        else {
            return this.channel.send(`⛔ ${msg}`);
        }
    }
    async prompt() {
        return Promise.reject('This feature is yet to be implemented!');
    }
    async promptReaction() {
        return Promise.reject('This feature is yet to be implemented!');
    }
    lockPerms(perms, options) {
        const { checkPerms } = this.client.permHandler;
        if (!this.member) {
            throw new Exception_1.default(100, 'Permission checks only work on guild members!');
        }
        if (!this.guild) {
            throw new Exception_1.default(100, 'Permission checks only work inside guilds!');
        }
        if (!(this.channel instanceof discord_js_1.TextChannel)) {
            throw new Exception_1.default(100, 'Permission checks only work inside guilds!');
        }
        const opts = Object.assign({
            checkBot: true,
            checkAdmin: true
        }, options);
        checkPerms(perms, this.member, this.channel, opts.checkAdmin);
        if (opts.checkBot)
            checkPerms(perms, this.guild.me, this.channel, opts.checkAdmin);
    }
    lock(...locks) {
        for (const lock of locks) {
            if (typeof lock === 'boolean') {
                if (lock)
                    continue;
                throw new Exception_1.default(100, ExceptionMessages_1.default[100]);
            }
            else {
                switch (lock) {
                    case 'guildOwner':
                        if (this.guild && this.guild.ownerID === this.author.id)
                            continue;
                        throw new Exception_1.default(100, 'Only guild owners may perform this action!');
                    case 'botOwner':
                        if (this.client.settings.owner === this.author.id)
                            continue;
                        throw new Exception_1.default(100, 'Only the bot owner may perform this action!');
                    case 'botDev':
                        if (this.client.settings.devs.includes(this.author.id))
                            continue;
                        throw new Exception_1.default(100, 'Only bot developers may perform this action!');
                    case 'dm':
                        if (this.channel.type === 'dm')
                            continue;
                        throw new Exception_1.default(100, 'This command can only be used in DM channels!');
                    case 'guild':
                        if (this.guild)
                            continue;
                        throw new Exception_1.default(100, 'This command can only be used in guild channels!');
                    case 'nsfw':
                        if (this.channel instanceof discord_js_1.TextChannel && this.channel.nsfw)
                            continue;
                        throw new Exception_1.default(100, 'This command can only be used in channels marked nsfw!');
                    default:
                        throw new Error('Invalid LockType provided!');
                }
            }
        }
    }
}
exports.default = Context;
