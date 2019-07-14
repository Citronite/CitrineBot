"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Exception_1 = __importDefault(require("../Exceptions/Exception"));
const ExceptionCodes_1 = __importDefault(require("../Exceptions/ExceptionCodes"));
const discord_js_1 = require("discord.js");
class PermHandler {
    checkFilters(ctx, config) {
        const { settings: globalConfig } = ctx.client;
        if (ctx.author.id === globalConfig.owner)
            return;
        const errors = [];
        if (config) {
            if (config.disabledRole) {
                const { member } = ctx;
                if (member && !member.roles.has(config.disabledRole))
                    errors.push('Disabled Role');
            }
            if (config.disabledUsers.includes(ctx.author.id))
                errors.push('Disabled User [Local]');
            if (config.disabledChannels.includes(ctx.channel.id))
                errors.push('Disabled Channel');
            if (config.disabledCommands.includes(ctx.command.name))
                errors.push('Disabled Command [Local]');
        }
        const { disabledUsers, disabledCommands } = globalConfig;
        if (disabledUsers.includes(ctx.author.id))
            errors.push('Disabled User [Global]');
        if (disabledCommands.includes(ctx.command.name))
            errors.push('Disabled Command [Global]');
        const code = ExceptionCodes_1.default.FAILED_FILTER_CHECKS;
        if (errors.length)
            throw new Exception_1.default(code, errors);
    }
    checkPerms(perms, member, channel, checkAdmin = true) {
        const memberPerms = channel.memberPermissions(member);
        if (!memberPerms)
            throw new Exception_1.default(ExceptionCodes_1.default.NOT_FOUND, `Member permissions not found (id: ${member.id})`);
        const missing = new discord_js_1.Permissions(memberPerms.missing(perms, checkAdmin)).toArray();
        if (!missing || !missing.length)
            return;
        const { MISSING_BOT_PERMS, MISSING_MEMBER_PERMS } = ExceptionCodes_1.default;
        const code = channel.client.user.id === member.id ? MISSING_BOT_PERMS : MISSING_MEMBER_PERMS;
        throw new Exception_1.default(code, ['Missing permissions:', ...missing]);
    }
    checkGuildOwner(guild, user) {
        if (guild.ownerID === user.id)
            return;
        throw new Exception_1.default(ExceptionCodes_1.default.PERMISSION_ERROR, 'Only guild owners may perform that action!');
    }
    checkBotOwner(user) {
        const client = user.client;
        if (user.id === client.settings.owner)
            return;
        throw new Exception_1.default(ExceptionCodes_1.default.PERMISSION_ERROR, 'Only bot owners may perform that action!');
    }
    checkBotDev(user) {
        const client = user.client;
        if (client.settings.devs.includes(user.id))
            return;
        throw new Exception_1.default(ExceptionCodes_1.default.PERMISSION_ERROR, 'Only bot developers may perform that action!');
    }
}
exports.default = PermHandler;
