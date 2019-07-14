"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SubCommand_1 = __importDefault(require("../Command/SubCommand"));
const Exception_1 = __importDefault(require("../Exceptions/Exception"));
const Context_1 = __importDefault(require("../Utils/Context"));
function isSubcommand(subcmd) {
    return subcmd instanceof SubCommand_1.default;
}
class CmdHandler {
    checkPrefix(message, config) {
        if (message.author.bot)
            return null;
        const client = message.client;
        const gPrefix = client.settings.globalPrefix;
        const id = client.user.id;
        let rgx = new RegExp(`^(<@!?${id}>|\\${gPrefix})\\s*`);
        if (config)
            rgx = new RegExp(`^(<@!?${id}>|\\${gPrefix}|\\${config.prefix})\\s*`);
        const match = message.content.match(rgx);
        return match ? match[0] : null;
    }
    getArgs(message, prefix, parseQuotes = true) {
        const text = message.content.slice(prefix.length);
        const client = message.client;
        const args = parseQuotes ? client.utils.djs.parseQuotes(text) : text.split(/ +/);
        return args.length ? args : null;
    }
    getBaseCmd(message, args) {
        if (!args || !args.length)
            return null;
        args = Array.from(args);
        let name = args.shift();
        if (!name)
            return null;
        else
            name = name.toLowerCase();
        const client = message.client;
        const fn = (val) => {
            const aliases = client.settings.aliases[val.name];
            return aliases && aliases.includes(name);
        };
        const cmd = client.commands.get(name) || client.commands.find(fn) || null;
        return cmd ? [cmd, args] : null;
    }
    getFinalCmd(message, args) {
        if (!args || !args.length)
            return null;
        const result = this.getBaseCmd(message, args);
        if (!result)
            return null;
        const [base, finalArgs] = result;
        let cmd = base;
        if (!cmd.subcommands)
            return result;
        if (!finalArgs.length)
            return result;
        while (cmd.subcommands) {
            const name = finalArgs[0];
            if (!name)
                break;
            const subcmd = cmd.subcommands.get(name.toLowerCase());
            if (subcmd) {
                cmd = subcmd;
                finalArgs.shift();
            }
            else {
                break;
            }
        }
        return [cmd, finalArgs];
    }
    *getCmdGenerator(message, args) {
        if (!args || !args.length)
            return;
        const result = this.getBaseCmd(message, args);
        if (!result)
            return;
        const [base, finalArgs] = result;
        let cmd = base;
        do {
            yield [cmd, finalArgs];
            if (!finalArgs.length || !finalArgs[0])
                break;
            if (!cmd.subcommands)
                break;
            cmd = cmd.subcommands.get(finalArgs[0].toLowerCase());
            if (!cmd)
                break;
        } while (finalArgs.shift());
    }
    async processCommand(message, config) {
        const invokedPrefix = this.checkPrefix(message, config);
        if (!invokedPrefix)
            return;
        const args = this.getArgs(message, invokedPrefix);
        if (!args)
            return;
        const cmdGenerator = this.getCmdGenerator(message, args);
        if (!cmdGenerator)
            return;
        if (config && config.deleteCmdCalls) {
            message.delete(config.deleteCmdCallsDelay);
        }
        const cmdChain = [];
        for (const value of cmdGenerator) {
            if (!value)
                break;
            cmdChain.push(value);
        }
        const len = cmdChain.length;
        for (let i = 0; i < len; i++) {
            const [cmd, finalArgs] = cmdChain[i];
            const subcmd = cmdChain[i + 1] ? cmdChain[i + 1][0] : undefined;
            const ctx = new Context_1.default({
                message,
                prefix: invokedPrefix,
                command: cmd,
                subcommand: isSubcommand(subcmd) ? subcmd : undefined
            });
            try {
                message.client.permHandler.checkFilters(ctx, config);
                await cmd.execute(ctx, ...finalArgs);
            }
            catch (err) {
                const error = Exception_1.default.parse(err);
                message.client.emit('exception', error, ctx);
                return;
            }
        }
    }
}
exports.default = CmdHandler;
