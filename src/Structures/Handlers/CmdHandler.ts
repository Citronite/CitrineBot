import { Message } from 'discord.js';
import { Command } from '../CommandStructs/AbstractCommand';
import { GuildConfig } from '../../Utils/GuildConfig';
import { BaseCommand } from '../CommandStructs/BaseCommand';
import { Exception } from '../ErrorStructs/Exception';
import { Context } from '../../Utils/Context';

export class CmdHandler {

  public checkPrefix(message: any, config?: GuildConfig): string | null {
    if (message.author.bot) return null;
    const gPrefix = message.client.settings.globalPrefix;
    const id = message.client.user.id;
    let rgx = new RegExp(`^(<@!?${id}>|\\${gPrefix})\\s*`);
    if (config) rgx = new RegExp(`^(<@!?${id}>|\\${gPrefix}|\\${config.prefix})\\s*`);
    return rgx.test(message.content) ? message.content.match(rgx)[0] : null;
  }

  public getArgs(message: any, prefix: string, parseQuotes: boolean = true): string[] | null {
    const text = message.content.slice(prefix.length);
    const args = parseQuotes ? message.client.utils.djs.parseQuotes(text) : text.split(/ +/);
    return args.length ? args : null;
  }

  public getBaseCmd(message: any, args: string[]): [BaseCommand, string[]] | [null, null] {
    if (!args || !args.length || !args[0]) return [null, null];

    const copy: any = Array.from(args);
    const name = copy.shift().toLowerCase();
    const finder = (val: Command) => {
      const aliases = message.client.settings.aliases[val.name];
      return aliases && aliases.includes(name);
    };
    const cmd = message.client.commands.get(name)
      || message.client.commands.find(finder)
      || null;

    return cmd ? [cmd, copy] : [null, null];
  }

  public getFinalCmd(message: Message, args: string[]): [Command, string[]] | [null, null] {
    if (!args || !args.length || !args[0]) return [null, null];

    // I hate typescript :')
    const [base, argsCopy]: [any, any] = this.getBaseCmd(message, args);
    if (!base) return [null, null];
    if (!base.subcommands || !argsCopy.length) return [base, argsCopy];

    // Set initial value of subCmd
    let subCmd = base;
    // Run loop as long as the subCmd has more subcommands
    while (subCmd.subcommands) {
      const name = argsCopy[0];
      if (!name) break;
      if (subCmd.subcommands.has(name.toLowerCase())) {
        subCmd = subCmd.subcommands.get(name.toLowerCase());
        argsCopy.shift();
      } else {
        break;
      }
    }
    return [subCmd, argsCopy];
  }

  // Basic idea is that this returns a generator for command calls
  // Example:
  // Command: [p]basecmd subcmd1 subcmd2 subcmd3 arg1 arg2
  // This would return a generator to iterate over basecmd, subcm1, subcmd2 etc.
  // At the end, it will also return the remaining arguments.
  public *getCmdChain(/*message: Message, args: string[]*/): any {
    throw new Error('This feature is yet to be implemented!');
  }

  public async processCommand(message: any, config?: GuildConfig): Promise<void> {
    try {
      // Check if the message was prefixed
      const invokedPrefix = this.checkPrefix(message, config);
      if (!invokedPrefix) return;

      // Obtain all arguments
      const args = this.getArgs(message, invokedPrefix);
      if (!args) return;

      // Obtain final subcommand and the rest of the arguments
      let [cmd, finalArgs]: [Command | null, string[] | null] = this.getFinalCmd(message, args);
      if (!cmd) return;
      if (!finalArgs) finalArgs = [];

      const ctx = new Context(message, invokedPrefix);

      try {
        if (config && config.deleteCmdCalls) {
          message.delete(config.deleteCmdCallsDelay);
        }
        await message.client.permHandler.checkCustomFilters(cmd, message);
        await cmd.execute(ctx, ...finalArgs);
      } catch (err) {
        // Fire exception *with* context & command,
        // if the exception occurred within the
        // filter checks or the command execution.
        const error: Exception = Exception.parse(err);
        message.client.emit('exception', error, ctx, cmd);
        return;
      }
    } catch (err) {
      // Fire exception *without* context/command,
      // if the exception occurred elsewhere
      const error: Exception = Exception.parse(err);
      message.client.emit('exception', error);
      return;
    }
  }
}
