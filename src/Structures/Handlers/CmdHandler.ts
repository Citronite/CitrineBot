import { Message } from 'discord.js';
import { GuildConfig } from '../../Utils/GuildConfig';
import { BaseCommand } from '../CommandStructs/BaseCommand';
import { Command } from '../CommandStructs/AbstractCommand';
import { BaseError } from '../ErrorStructs/BaseError';
import { ErrorCodes } from '../ErrorStructs/ErrorCodes';
import { CommandError } from '../ErrorStructs/CommandError';
import { Context } from '../../Utils/Context';
import { ExceptionParser } from '../ErrorStructs/ExceptionParser';

export class CmdHandler {
	constructor() {
		throw new Error('This class may not be instantiated with new!');
	}

	public static checkPrefix(message: any, config: GuildConfig): string | null {
		if (message.author.bot) return null;

		const gPrefix = message.client.settings.globalConfig.prefix;
		const lPrefix = config.prefix;
		const id = message.client.user.id;
		const rgx = new RegExp(`^(<@!?\\${id}>|\\${lPrefix})\\|\\${gPrefix})\\s*`);

		return rgx.test(message.content) ? message.content.match(rgx)[0] : null;
	}

	public static getArgs(message: any, prefix: string, parseQuotes: boolean = true): string[] | null {
		const sliceLength = prefix.length;
		const text = message.content.slice(sliceLength);
		const args = parseQuotes ? message.client.utils.djs.parseQuotes(text) : text.split(/ +/);
		return args.length ? args : null;
	}

	public static getBaseCmd(message: any, args: string[]): [BaseCommand, string[]] | [null, null] {
		if (!args || !args.length || !args[0]) return [null, null];

		const copy: any = Array.from(args);
		const name = copy.shift().toLowerCase();
		const cmd = message.client.commands.get(name) ||
			message.client.commands.find((val: Command) => {
				const { aliases } = message.client.settings.globalConfig.aliases[val.name];
				return aliases && aliases.includes(name);
			}) ||	null;

		return cmd ? [cmd, copy] : [null, null];
	}

	public static getFinalCmd(message: Message, args: string[]): [Command, string[]] | [null, null] {
		if (!args || !args.length || !args[0]) return [null, null];

		// I hate typescript :')
		const [base, argsCopy]: [any, any] = this.getBaseCmd(message, args);

		if (!base) return [null, null];
		if (!base.subcommands) return [base, argsCopy];

		let subCmd = base;
		while (true) {
			if (subCmd.subcommands.has(argsCopy[0].toLowerCase())) {
				subCmd = subCmd.subcommands.get(argsCopy[0].toLowerCase());
				argsCopy.shift();
			} else {
				break;
			}
		}

		return [subCmd, argsCopy];
	}

	public static *getCmdChainIterator(message: Message, args: string[]): IterableIterator<Command> {
		// Implement this!
		// Basic idea is that this returns a generator, which can be used
		// to iterate over a command chain
		// Example:
		// If the command is: [p]basecmd subcmd1 subcmd2 subcmd3 arg1 arg2
		// This would return a generator to iterate over basecmd, subcm1, subcmd2 etc.
		// At the end, it would also return the remaining arguments.
		// But not sure how to implement this =/
		throw new Error('To be implemented!');
	}

	public static async processCommand(message: any, config: GuildConfig): Promise<void> {

		try {
			// Check if the message was prefixed. If so, obtain the invoked prefix.
			// Otherwise, return.
			const invokedPrefix = this.checkPrefix(message, config);
			if (!invokedPrefix) return;

			// Check if the message contains any arguments (including the base command call)
			// If not, return.
			const args = this.getArgs(message, invokedPrefix);
			if (!args) return;

			// Gets the last command in the "command chain", and the remaining args.
			// If there is no command, return.
			// Example:
			// If the command is: [p]basecmd subcmd1 subcmd2 @randomMention @anotherMention
			// This would return: [subcmd2, ['@randomMention', '@anotherMention']]
			let [cmd, finalArgs]: [Command | null, string[] | null] = this.getFinalCmd(message, args);
			if (!cmd) return;
			if (!finalArgs) finalArgs = [''];

			// Create the Context class.
			const ctx = new Context(message, invokedPrefix);

			try {
				// Check Citrine's custom filters. This automatically throws a BaseError if
				// the filter isn't passed successfully
				await message.client.permHandler.checkCustomFilters(cmd, message, message.client);

				// Execute the command. Note that args are not passed as an array.
				await cmd.execute(ctx, ...finalArgs);

			} catch (err) {
				// If the error occurred within the chip command, or the customFilterCheck,
				// then send it to the chat and return.
				const parsed = ExceptionParser.parse(err, cmd);
				ctx.send(parsed.toEmbed());
				return;
			}
		} catch (err) {
			// If the error occurred within the code, then log it to the console as well
			// as the chat, and then return.
			message.client.logger.error(err);
			const error = new BaseError(ErrorCodes.UNKNOWN_ERROR, err.message);
			message.channel.send(error.toEmbed());
			return;
		}
	}
}
