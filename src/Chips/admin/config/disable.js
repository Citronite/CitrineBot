const { SubCommand } = require('../../../exports');

class Disable extends SubCommand {
  constructor() {
    super({
      name: 'disable',
      description: 'Disable guilds/users/commands globally.',
      usage: '[p]config disable <"cmd" | "user" | "channel">'
    });
  }
}

class DisableCmd extends SubCommand {
  constructor() {
    super({
      name: 'cmd',
      description: 'Locally disable bot commands. Note that only base commands can be disabled.',
      usage: '[p]config disable cmd [...command]'
    });
  }

  async execute(ctx, ...cmds) {
    const { inline } = ctx.client.utils.format;
    const data = await ctx.client.getGuild(ctx.guild.id);

    if (cmds.length) {
      const disabled = [];
      for (const cmd of cmds) {
        const [found] = ctx.client.cmdHandler.getBaseCmd(ctx.message, [cmd]);
        if (!found) continue;
        data.disableCommand(found.name);
        disabled.push(cmd);
      }
      if (disabled.length) {
        await ctx.client.setGuild(ctx.guild.id, data);
        return ctx.success(`Successfully disabled commands: ${inline(disabled).join(', ')}`);
      } else {
        return ctx.error('No commands were disabled. Are you sure you provided the correct names?');
      }
    } else {
      const { disabledCommands: disabled } = data;
      if (disabled.length) {
        return ctx.send(`Currently disabled commands: ${inline(disabled).join(', ')}`);
      } else {
        return ctx.send('No commands disabled currently.');
      }
    }
  }
}

class DisableUser extends SubCommand {
  constructor() {
    super({
      name: 'user',
      description:
        'Globally disable users from using this bot. Only works on users that the bot can see.',
      usage: '[p]config disable user [...UserID/@User]'
    });
  }

  async execute(ctx, ...users) {
    const data = await ctx.client.getGuild(ctx.guild.id);

    if (users.length) {
      const disabled = [];
      for (let user of users) {
        user = await ctx.client.utils.djs.resolveUser(ctx.client, user);
        if (!user) continue;
        data.disableUser(user.id);
        disabled.push(user.tag);
      }
      if (disabled.length) {
        await ctx.client.setGuild(ctx.guild.id, data);
        return ctx.success(
          `Successfully disabled users: ${data.disabledUsers.map(id => `<@${id}>`).join(', ')}`
        );
      } else {
        return ctx.error('No users were disabled. Are you sure you provided the correct names?');
      }
    } else {
      const { disabledUsers: disabled } = ctx.client.settings;
      if (disabled.length) {
        return ctx.send(`Currently disabled Users: ${disabled.map(id => `<@${id}>`).join(', ')}`);
      } else {
        return ctx.send('No users disabled currently.');
      }
    }
  }
}

class DisableChannel extends SubCommand {
  constructor() {
    super({
      name: 'channel',
      description:
        'Locally disable the bot from specific channels. Only works on channels the bot can see.',
      usage: '[p]config disable channel [...#Channel/ChannelID]'
    });
  }

  async execute(ctx, ...channels) {
    const { inline } = ctx.client.utils.format;
    const data = await ctx.client.getGuild(ctx.guild.id);

    if (channels.length) {
      const disabled = [];
      for (let channel of channels) {
        channel = await ctx.client.utils.djs.resolveGuildChannel(ctx.guild, channel);
        if (!channel) continue;
        data.disableChannel(channel.id);
        disabled.push(channel.name);
      }

      if (disabled.length) {
        await ctx.client.setGuild(ctx.guild.id, data);
        return ctx.success(`Successfully disabled channels:\n${inline(disabled).join(', ')}`);
      } else {
        return ctx.error('No channels were disabled. Are you sure you provided the correct names?');
      }
    } else {
      const { disabledChannels: disabled } = ctx.client.settings;
      if (disabled.length) {
        return ctx.send(
          `Currently disabled channels: ${disabled.map(id => `<#${id}>`).join(', ')}`
        );
      } else {
        return ctx.send('No channels disabled currently.');
      }
    }
  }
}

const a = new DisableCmd();
const b = new DisableUser();
const c = new DisableChannel();
module.exports = new Disable().register(a, b, c);
