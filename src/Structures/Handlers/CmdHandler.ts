import { Message } from 'discord.js';
import { Command } from '../Command/AbstractCommand';
import { GuildConfig } from '../../Utils/GuildConfig';
import { BaseCommand } from '../Command/BaseCommand';
import { Exception } from '../Exceptions/Exception';
import { Context } from '../../Utils/Context';
import { SubCommand } from '../Command/SubCommand';
import { ICmdHandler } from 'typings';

function isSubcommand(subcmd: any): subcmd is SubCommand {
    return subcmd instanceof SubCommand;
}

export class CmdHandler implements ICmdHandler {

    public checkPrefix(message: Message & any, config?: GuildConfig): string | null {
        if (message.author.bot) return null;
        const gPrefix = message.client.settings.globalPrefix;
        const id = message.client.user.id;
        let rgx = new RegExp(`^(<@!?${id}>|\\${gPrefix})\\s*`);
        if (config) rgx = new RegExp(`^(<@!?${id}>|\\${gPrefix}|\\${config.prefix})\\s*`);
        return rgx.test(message.content) ? message.content.match(rgx)[0] : null;
    }

    public getArgs(message: Message & any, prefix: string, parseQuotes: boolean = true): string[] | null {
        const text = message.content.slice(prefix.length);
        const args = parseQuotes ? message.client.utils.djs.parseQuotes(text) : text.split(/ +/);
        return args.length ? args : null;
    }

    public getBaseCmd(message: Message & any, args: string[]): [BaseCommand, string[]] | null {
        if (!args || !args.length) return null;

        let name = args.shift();
        if (!name) return null;
        else name = name.toLowerCase();

        const fn = (val: Command) => {
            const aliases = message.client.settings.aliases[val.name];
            return aliases && aliases.includes(name);
        };
        const cmd = message.client.commands.get(name)
            || message.client.commands.find(fn)
            || null;

        return cmd ? [cmd, args] : null;
    }

    public getFinalCmd(message: Message, args: string[]): [Command, string[]] | null {
        if (!args || !args.length) return null;

        const result = this.getBaseCmd(message, args);
        if (!result) return null;
        const [base, finalArgs] = result;

        let cmd: Command | undefined = base;
        if (!cmd.subcommands) return result;
        if (!finalArgs.length) return result;

        while (cmd.subcommands) {
            const name = finalArgs[0];
            if (!name) break;
            const subcmd: Command | undefined = cmd.subcommands.get(name.toLowerCase());
            if (subcmd) {
                cmd = subcmd;
                finalArgs.shift();
            } else {
                break;
            }
        }
        return [cmd, finalArgs];
    }

    public *getCmdGenerator(message: Message, args: string[]): IterableIterator<[Command, string[]] | undefined> {
        if (!args || !args.length) return;

        const result = this.getBaseCmd(message, args);
        if (!result) return;

        const [base, finalArgs] = result;
        let cmd: Command | undefined = base;
        do {
            yield [cmd, finalArgs];
            if (!finalArgs.length) break;
            if (!cmd.subcommands) break;
            const name = finalArgs[0];
            if (!name) break;
            cmd = cmd.subcommands.get(name.toLowerCase());
            if (!cmd) break;
        } while (finalArgs.shift());
    }

    public async processCommand(message: any, config?: GuildConfig): Promise<void> {
        const invokedPrefix = this.checkPrefix(message, config);
        if (!invokedPrefix) return;

        const args = this.getArgs(message, invokedPrefix);
        if (!args) return;

        const cmdGenerator = this.getCmdGenerator(message, args);
        if (!cmdGenerator) return;

        if (config && config.deleteCmdCalls) {
            message.delete(config.deleteCmdCallsDelay);
        }

        const cmdChain: [Command, string[]][] = [];
        for (const value of cmdGenerator) {
            if (!value) break;
            cmdChain.push(value);
        }

        const len = cmdChain.length;
        for (let i = 0; i < len; i++) {
            const [cmd, finalArgs] = cmdChain[i];
            const subcmd = cmdChain[i + 1] ? cmdChain[i + 1][0] : undefined;
            const ctx = new Context({
                message,
                prefix: invokedPrefix,
                command: cmd,
                subcommand: isSubcommand(subcmd) ? subcmd : undefined
            });

            try {
                message.client.permHandler.checkFilters(ctx, config);
                await cmd.execute(ctx, ...finalArgs);
            } catch (err) {
                const error = Exception.parse(err);
                message.client.emit('exception', error, ctx);
                return;
            }
        }
    }
}
