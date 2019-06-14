const { SubCommand } = require('../../../exports');

class Enable extends SubCommand {
  constructor() {
    super({
      name: 'enable',
      description: 'Enable guilds/users/commands globally.',
      usage: '[p]gconfig enable <"guild" | "user" | "cmd">'
    });
  }
}

class EnableGuild extends SubCommand {
  constructor() {
    super({
      name: 'guild',
      description: 'Globally enable guilds from using this bot.',
      usage: '[p]gconfig enable guild [...GuildID/Name]'
    });
  }

  async execute(ctx, ...guilds) {
    const { inline } = ctx.client.utils.format;

    if (guilds.length) {
      for (const guild of guilds) {
        ctx.client.settings.enableGuild(guild);
      }
      await ctx.client.settings.save();
      await ctx.success(
        `Successfully enabled guilds: ${inline(guilds).join(', ')}`
      );
    } else {
      const disabled = ctx.client.settings.disabledGuilds;
      if (disabled.length) {
        await ctx.send(
          `Currently disabled guilds: ${inline(disabled).join(', ')}`
        );
      } else {
        await ctx.send('No guilds disabled currently.');
      }
    }
  }
}

class EnableUser extends SubCommand {
  constructor() {
    super({
      name: 'user',
      description: 'Globally enable users from using this bot.',
      usage: '[p]gconfig enable user [...UserID/@User]'
    });
  }

  async execute(ctx, ...users) {
    if (users.length) {
      for (const user of users) {
        ctx.client.settings.enableUser(user);
      }
      await ctx.client.settings.save();
      await ctx.send(
        `Successfully enabled users: ${users.map(id => `<@${id}>`)}`
      );
    } else {
      const disabled = ctx.client.settings.disabledUsers;
      if (disabled.length) {
        await ctx.send(
          `Currently disabled users: ${disabled.map(id => `<@${id}>`)}`
        );
      } else {
        await ctx.send(`No users enabled currently.`);
      }
    }
  }
}

class EnableCmd extends SubCommand {
  constructor() {
    super({
      name: 'cmd',
      description:
        'Globally enable commands. Only base commands may be enabled.',
      usage: '[p]gconfig enable cmd [...commands]'
    });
  }

  async execute(ctx, ...cmds) {
    const { inline } = ctx.client.utils.format;

    if (cmds.length) {
      const enabled = [];

      for (const cmd of cmds) {
        const [exists] = ctx.client.cmdHandler.getBaseCmd(ctx.message, [cmd]);
        if (!exists || exists.chip === 'core') continue;
        ctx.client.settings.enableCommand(cmd);
        enabled.push(cmd);
      }

      if (enabled.length) {
        await ctx.client.settings.save();
        ctx.success(
          `Successfully enabled commands:\n${inline(enabled).join('\n')}`
        );
      } else {
        ctx.error(
          'No commands were enabled. Did you provide the correct names?'
        );
      }
    } else {
      const disabled = ctx.client.settings.disabledCommands;
      if (disabled.length) {
        await ctx.send(
          `Currently disabled commands: ${inline(disabled).join(', ')}`
        );
      } else {
        await ctx.send('No commands disabled currently.');
      }
    }
  }
}

const g = new EnableGuild();
const u = new EnableUser();
const c = new EnableCmd();
module.exports = new Enable().registerSubCommands(g, u, c);
