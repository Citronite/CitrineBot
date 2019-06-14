const { SubCommand } = require('../../../exports');

class Disable extends SubCommand {
  constructor() {
    super({
      name: 'disable',
      description: 'Disable guilds/users/commands globally.',
      usage: '[p]gconfig disable <"guild" | "user" | "cmd">'
    });
  }
}

class DisableGuild extends SubCommand {
  constructor() {
    super({
      name: 'guild',
      description: 'Globally disable guilds from using this bot.',
      usage: '[p]gconfig disable guild [...GuildID/Name]'
    });
  }

  async execute(ctx, ...guilds) {
    const { inline } = ctx.client.utils.format;

    if (guilds.length) {
      for (const guild of guilds) {
        let id;
        const found = ctx.client.guilds.find(g => g.name === guild || g.id === guild);
        if (found) id = found.id
        else id = guild;
        ctx.client.settings.disableGuild(id);
      }
      await ctx.client.settings.save();
      await ctx.success(`Successfully disabled guilds: ${inline(guilds).join(', ')}`);
    } else {
      const disabled = ctx.client.settings.disabledGuilds;
      if (disabled.length) {
        await ctx.send(`Currently disabled guilds: ${inline(disabled).join(', ')}`);
      } else {
        await ctx.send('No guilds disabled currently.');
      }
    }
  }
}

class DisableUser extends SubCommand {
  constructor() {
    super({
      name: 'user',
      description: 'Globally disable users from using this bot.',
      usage: '[p]gconfig disable user [...UserID/@User]'
    });
  }

  async execute(ctx, ...users) {
    if (users.length) {
      for (const user of users) {
        ctx.client.settings.disableUser(user);
      }
      await ctx.client.settings.save();
      await ctx.send(`Successfully disabled users: ${users.map(id => `<@${id}>`)}`);
    } else {
      const disabled = ctx.client.settings.disabledUsers;
      if (disabled.length) {
        await ctx.send(`Currently disabled Users: ${disabled.map(id => `<@${id}>`)}`);
      } else {
        await ctx.send(`No users disabled currently.`);
      }
    }
  }
}

class DisableCmd extends SubCommand {
  constructor() {
    super({
      name: 'cmd',
      description:
        'Globally disable commands. Only base commands may be disabled. Commands from the `core` chip cannot be disabled.',
      usage: '[p]gconfig disable cmd [...commands]'
    });
  }

  async execute(ctx, ...cmds) {
    const { inline } = ctx.client.utils.format;

    if (cmds.length) {
      const disabled = [];

      for (const cmd of cmds) {
        const [exists] = ctx.client.cmdHandler.getBaseCmd(ctx.message, [cmd]);
        if (!exists || exists.chip === 'core') continue;
        ctx.client.settings.disableCommand(cmd);
        disabled.push(cmd);
      }

      if (disabled.length) {
        await ctx.client.settings.save();
        ctx.success(
          `Successfully disabled commands:\n${inline(disabled).join('\n')}`
        );
      } else {
        ctx.error(
          'No commands were disabled. Did you provide the correct names?'
        );
      }
    } else {
      const disabled = ctx.client.settings.disabledCommands;
      if (disabled.length) {
        await ctx.send(`Currently disabled commands: ${inline(disabled).join(', ')}`);
      } else {
        await ctx.send('No commands disabled currently.');
      }
    }
  }
}

const g = new DisableGuild();
const u = new DisableUser();
const c = new DisableCmd();
module.exports = new Disable().registerSubCommands(g, u, c);
