"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const QuickEmbed_1 = __importDefault(require("../Structures/Utils/QuickEmbed"));
/**
 * These errors are not logged to the console
 * 101 - MISSING_BOT_PERMS
 * 102 - MISSING_MEMBER_PERMS
 * 103 - FAILED_FILTER_CHECKS
 * 201 - INSIFFICIENT_ARGS
 * 202 - INVALID_ARGS
 */
const ignored = [101, 102, 103, 201, 202];
module.exports = {
    name: 'exception',
    listener: async (client, error, ctx, cmd) => {
        if (ctx) {
            if (cmd && error.code === 201) {
                await ctx.send(QuickEmbed_1.default.cmdHelp(ctx, cmd));
            }
            else if (client.settings.verbose) {
                await ctx.send(error.toEmbed());
            }
            else {
                ctx.send(QuickEmbed_1.default.error('Unknown error occurred!').setFooter('⛔ Check console for more details!'));
            }
        }
        if (ignored.includes(error.code))
            return;
        else {
            client.logger.error(error);
            client.lastException = error;
        }
    }
};
