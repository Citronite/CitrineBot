const { SubCommand } = require('../../../exports');

class Aliases extends SubCommand {
  constructor() {
    super({
      name: 'aliases',
      description: "View or edit the list of command aliases.",
      usage: '[p]gconfig aliases ["add" | "remove"]'
    });
  }

  async execute(ctx) {
    if (!ctx.subcommand) {
        const aliases = ctx.client.settings.aliases;
        const list = [];
        for (const key of Object.keys(aliases)) {
          list.push(`${key}: ${aliases[key].join(', ')}`);
        }
        if (list.length) {
          ctx.send(`Current list of command aliases: ${list.join('\n')}`);
        } else {
          ctx.send('You have not registered any command aliases so far!');
        }
    }
  }
}

class Add extends SubCommand {
    constructor() {
        super({
            name: 'add',
            description: 'Add command aliases. Only aliases for base commands can be added',
            usage: '[p]gconfig aliases add <command> <alias>'
        });
    }

    async execute(ctx, cmd, alias) {
        if (!cmd || !alias) {
          ctx.subcommand = undefined;
          this.parent.execute(ctx);
        } else {
          const exists = ctx.client.commands.get(cmd);
            if (!exists) {
              ctx.error(`The command \`${cmd}\` does not exist!`);
              return;
            }
            const alrExists = ctx.client.cmdHandler.getBaseCmd(ctx.message, Array.from([alias]));
            if (alrExists) {
              ctx.error(`The alias \`${alias}\` is already registered for the command \`${alrExists.name}\``);
            } else {
              ctx.client.settings.addAlias(cmd, alias);
              await ctx.client.settings.save();
              ctx.success(`Successfully registered \`${alias}\` as an alias for \`${cmd}\``);
            }
        }
    }
}

class Remove extends SubCommand {
  constructor() {
      super({
          name: 'remove',
          description: 'Remove command aliases.',
          usage: '[p]gconfig aliases remove <command> <alias>'
      });
  }

  async execute(ctx, cmd, alias) {
      if (!cmd || !alias) {
          ctx.subcommand = undefined;
          this.parent.execute(ctx);
      } else {
        const found = ctx.client.commands.get(cmd);
        if (!found) {
          ctx.error(`The command \`${cmd}\` does not exist!`);
          return;
        }
        const exists = ctx.client.cmdHandler.getBaseCmd(ctx.message, Array.from([alias]));
        if (exists) {
          ctx.client.settings.removeAlias(cmd, alias);
          await ctx.settings.save();
          ctx.success(`Successfully removed \`${alias}\` as an alias for \`${cmd}\``);
        } else {
          ctx.error(`The alias \`${alias}\` does not exist for \`${cmd}\``);
        }
      }
  }
}

const a = new Add();
const r = new Remove();
module.exports = new Aliases().registerSubCommands(a, r);
