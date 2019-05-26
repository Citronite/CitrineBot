const { SubCommand } = require('../../../exports');

class DisableGuild extends SubCommand {
  constructor() {
    super({
      name: 'guild',
      description: 'Globally disable guilds from using Citrine.',
      usage: '[p]gconfig disable user [...UserID/@User]'
    });
  }
}

class DisableUser extends SubCommand {
  constructor() {
    super({
      name: 'user',
      description: 'Globally disable users from using Citrine.',
      usage: '[p]gconfig disable user [...UserID/@User]'
    });
  }
}

class DisableCmd extends SubCommand {
    constructor() {
      super({
        name: 'cmd',
        description: 'Globally disable commands. Only base commands may be disabled. Commands from the `core` chip cannot be disabled.',
        usage: '[p]gconfig disable cmd [...commands]'
      });
    }
  
    async execute(ctx, ...cmds) {
        if (cmds.length) {
            const disabled = [];
            for (const cmd of cmds) {
                const [exists,] = ctx.client.cmdHandler.getBaseCmd(ctx.message, [cmd]);
                if (!exists) continue;
                ctx.client.settings.disableCommand(cmd);
                disabled.push(cmd);
            }
            if (disabled.length) {
                const { inline } = ctx.client.utils.format;
                await ctx.client.settings.save();
                ctx.success(`Successfully disabled commands:\n${inline(disabled).join('\n')}`);
                return;
            }
            else {
                ctx.error('No commands were disabled. Did you provide the correct names?');
                return;
            }
        }
        else {
            const { inline } = ctx.client.utils.format;
            const disabled = ctx.client.settings.disabledCommands;
            if (disabled.length) {
                await ctx.send(`Disabled Commands: ${inline(disabled).join(', ')}`);
            }
            else {
                await ctx.send('No commands disabled currently.');
            }
            return;
        }
    }
}

class Disable extends SubCommand {
    constructor() {
      super({
        name: 'disable',
        description: 'Disable guilds/users/commands globally.',
        usage: '[p]gconfig disable <"guild" | "user" | "cmd">'
      });
    }
}

const g = new DisableGuild();
const u = new DisableUser();
const c = new DisableCmd();
module.exports = new Disable().registerSubCommands(g, u, c);
