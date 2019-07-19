import { SubCommand } from '../../../exports';
import Context from '../../../Structures/Utils/Context';

class Aliases extends SubCommand {
  public constructor() {
    super({
      name: 'aliases',
      description: 'View or edit the list of command aliases.',
      usage: '[p]gconfig aliases ["add" | "remove"]'
    });
  }

  public async execute(ctx: Context) {
    if (!ctx.subcommand) {
      const aliases = ctx.client.settings.aliases;
      const list = [];
      for (const key of Object.keys(aliases)) {
        list.push(`${key}: ${aliases[key].join(', ')}`);
      }
      if (list.length) {
        const { format } = ctx.client.utils;
        ctx.send(`Current list of command aliases:\n${format.block(list.join('\n'))}`);
      } else {
        ctx.send('You have not registered any command aliases so far!');
      }
    }
  }
}

class Add extends SubCommand {
  public constructor() {
    super({
      name: 'add',
      description: 'Add command aliases. Only aliases for base commands can be added',
      usage: '[p]gconfig aliases add <command> <alias>'
    });
  }

  public async execute(ctx: Context, cmd: string, alias: string) {
    if (!cmd || !alias) {
      throw 'INSUFFICIENT_ARGS';
    } else {
      const found = ctx.client.commands.get(cmd);
      if (!found) {
        ctx.error(`The command \`${cmd}\` does not exist!`);
        return;
      }
      const exists = ctx.client.cmdHandler.getBaseCmd(ctx.message, [alias]);
      if (exists) {
        ctx.error(
          `The alias \`${alias}\` is already registered for the command \`${exists[0].name}\``
        );
      } else {
        ctx.client.settings.addAlias(cmd, alias);
        await ctx.client.settings.save();
        ctx.success(`Successfully registered \`${alias}\` as an alias for \`${cmd}\``);
      }
    }
  }
}

class Remove extends SubCommand {
  public constructor() {
    super({
      name: 'remove',
      description: 'Remove command aliases.',
      usage: '[p]gconfig aliases remove <command> <alias>'
    });
  }

  public async execute(ctx: Context, cmd: string, alias: string) {
    if (!cmd || !alias) {
      throw 'INSUFFICIENT_ARGS';
    } else {
      const found = ctx.client.commands.get(cmd);
      if (!found) {
        ctx.error(`The command \`${cmd}\` does not exist!`);
        return;
      }
      const exists = ctx.client.cmdHandler.getBaseCmd(ctx.message, Array.from([alias]));
      if (exists) {
        ctx.client.settings.removeAlias(cmd, alias);
        await ctx.client.settings.save();
        ctx.success(`Successfully removed \`${alias}\` as an alias for \`${cmd}\``);
      } else {
        ctx.error(`The alias \`${alias}\` does not exist for \`${cmd}\``);
      }
    }
  }
}

const a = new Add();
const b = new Remove();
module.exports = new Aliases().register(a, b);
