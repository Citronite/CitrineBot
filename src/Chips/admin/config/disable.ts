import { SubCommand } from '../../../exports';
import Context from '../../../Structures/Utils/Context';

class Disable extends SubCommand {
  public constructor() {
    super({
      name: 'disable',
      description: 'Disable guilds/users/commands globally.',
      usage: '[p]config disable <"cmd" | "user" | "channel">'
    });
  }
}

class DisableCmd extends SubCommand {
  public constructor() {
    super({
      name: 'cmd',
      description: 'Locally disable bot commands. Note that only base commands can be disabled.',
      usage: '[p]config disable cmd [...command]'
    });
  }

  public async execute(ctx: Context, ...cmds: string[]) {
    const { inline }: any = ctx.client.utils.format;
    const { guild }: any = ctx;

    const data = await ctx.client.getGuild(guild.id);
    if (!data) throw [404, 'GuildConfig not found!'];

    if (cmds.length) {
      const disabled = [];
      for (const cmd of cmds) {
        const found = ctx.client.cmdHandler.getBaseCmd(ctx.message, [cmd]);
        if (!found) continue;
        data.disableCommand(found[0].name);
        disabled.push(cmd);
      }
      if (disabled.length) {
        await ctx.client.setGuild(guild.id, data);
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
  public constructor() {
    super({
      name: 'user',
      description:
        'Globally disable users from using this bot. Only works on users that the bot can see.',
      usage: '[p]config disable user [...UserID/@User]'
    });
  }

  public async execute(ctx: Context, ...users: string[]) {
    const { guild }: any = ctx;

    const data = await ctx.client.getGuild(guild.id);
    if (!data) throw [404, 'GuildConfig not found!'];

    if (users.length) {
      const disabled = [];
      for (let user of users) {
        const found = await ctx.client.utils.djs.resolveUser(ctx.client, user);
        if (!found) continue;
        data.disableUser(found.id);
        disabled.push(found.tag);
      }
      if (disabled.length) {
        await ctx.client.setGuild(guild.id, data);
        return ctx.success(
          `Successfully disabled users: ${data.disabledUsers.map(id => `<@${id}>`).join(', ')}`
        );
      } else {
        return ctx.error('No users were disabled. Are you sure you provided the correct names?');
      }
    } else {
      const { disabledUsers: disabled } = data;
      if (disabled.length) {
        return ctx.send(`Currently disabled Users: ${disabled.map(id => `<@${id}>`).join(', ')}`);
      } else {
        return ctx.send('No users disabled currently.');
      }
    }
  }
}

class DisableChannel extends SubCommand {
  public constructor() {
    super({
      name: 'channel',
      description:
        'Locally disable the bot from specific channels. Only works on channels the bot can see.',
      usage: '[p]config disable channel [...#Channel/ChannelID]'
    });
  }

  public async execute(ctx: Context, ...channels: string[]) {
    const { inline }: any = ctx.client.utils.format;
    const { guild }: any = ctx;

    const data = await ctx.client.getGuild(guild.id);
    if (!data) throw [404, 'GuildConfig not found!'];

    if (channels.length) {
      const disabled = [];
      for (let channel of channels) {
        const found = await ctx.client.utils.djs.resolveGuildChannel(guild, channel);
        if (!found) continue;
        data.disableChannel(found.id);
        disabled.push(found.name);
      }

      if (disabled.length) {
        await ctx.client.setGuild(guild.id, data);
        return ctx.success(`Successfully disabled channels:\n${inline(disabled).join(', ')}`);
      } else {
        return ctx.error('No channels were disabled. Are you sure you provided the correct names?');
      }
    } else {
      const { disabledChannels: disabled } = data;
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
