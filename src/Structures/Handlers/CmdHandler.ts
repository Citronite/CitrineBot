import { Message } from 'discord.js';
import { GuildConfig } from '../../Utils/GuildConfig';
import { BaseCommand } from '../CommandStructs/BaseCommand';
import { Command } from '../CommandStructs/AbstractCommand';
import { BaseError } from '../ErrorStructs/BaseError';
import { ErrorCodes } from '../ErrorStructs/ErrorCodes';
import { Context } from '../../Utils/Context';
import { ExceptionParser } from '../ErrorStructs/ExceptionParser';

export class CmdHandler {
  constructor() {
    throw new Error('This class may not be instantiated with the new keyword!');
  }

  public static checkPrefix(message: any, config?: GuildConfig): string | null {
    if (message.author.bot) return null;
    const gPrefix = message.client.settings.globalPrefix;
    const id = message.client.user.id;
    let rgx = new RegExp(`^(<@!?${id}>|\\${gPrefix})\\s*`);
    if (config) rgx = new RegExp(`^(<@!?${id}>|\\${gPrefix}|\\${config.prefix})\\s*`);
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
        const aliases = message.client.settings.aliases[val.name];
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
      if (!subCmd.subcommands.size) break;
      const name = argsCopy.shift().toLowerCase();
      if (subCmd.subcommands.has(name)) {
        subCmd = subCmd.subcommands.get(name);
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
      // Otherwise, return (since the message wasn't a bot command)
      const invokedPrefix = this.checkPrefix(message, config);
      if (!invokedPrefix) return;

      // Check if the message contains any arguments (including the base command call)
      // If not, return.
      const args = this.getArgs(message, invokedPrefix);
      if (!args) return;

      // Get the last command in the "command chain", and the remaining args.
      // If no command is found, return silently.
      // Example:
      // If the command is: [p]basecmd subcmd1 subcmd2 @randomMention anArgument
      // This would return: [subcmd2, ['@randomMention', 'anArgument']]
      let [cmd, finalArgs]: [Command | null, string[] | null] = this.getFinalCmd(message, args);
      if (!cmd) return;
      if (!finalArgs) finalArgs = [];

      // Now we know that the message is a bot command, check if
      // config.deleteCmdCalls is set for this guild. If so, delete the message.
      if (config.deleteCmdCalls) message.delete(config.deleteCmdCallsDelay);

      const ctx = new Context(message, config, invokedPrefix);

      try {
        // Check Citrine's custom filters. This automatically throws a BaseError if
        // the filter isn't passed successfully
        await message.client.permHandler.checkCustomFilters(cmd, message, message.client);

        // Execute the command. Note that args are not passed as an array.
        cmd.execute(ctx, ...finalArgs);
      } catch (err) {
        // If error occurred while executing the command,
        // emit the commandError event
        const parsedError = ExceptionParser.parse(err, cmd);
        message.client.emit('commandError', ctx, parsedError);
      }
    } catch (err) {
      // If the error occurred within the above code, then log it to the console as well
      // as the chat, and then return.
      const error = new BaseError(ErrorCodes.UNKNOWN_ERROR, [err.message]);
      message.channel.send(error.toEmbed());
      message.client.logger.error(err);
      message.client.lastException = err;
    }
  }
}
