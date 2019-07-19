import { SubCommand } from '../../../exports';
import Context from '../../../Structures/Utils/Context';

class Enable extends SubCommand {
  public constructor() {
    super({
      name: 'enable',
      description: 'Enable guilds/users/commands globally.',
      usage: '[p]gconfig enable <"guild" | "user" | "cmd">'
    });
  }
}

class EnableGuild extends SubCommand {
  public constructor() {
    super({
      name: 'guild',
      description: 'Globally enable guilds from using this bot.',
      usage: '[p]gconfig enable guild [...GuildID/Name]'
    });
  }

  public async execute(ctx: Context, ...guilds: string[]) {
    const { inline }: any = ctx.client.utils.format;

    if (guilds.length) {
      const enabled = [];
      for (const guild of guilds) {
        const found = ctx.client.guilds.find(g => g.name === guild || g.id === guild);
        if (!found) continue;
        ctx.client.settings.enableGuild(found.id);
        enabled.push(found.name);
      }

      if (enabled.length) {
        await ctx.client.settings.save();
        return ctx.success(`Successfully enabled guilds: ${inline(enabled).join(', ')}`);
      } else {
        return ctx.error('No guilds were enabled. Are you sure you provided the correct names?');
      }
    } else {
      const { disabledGuilds: disabled } = ctx.client.settings;
      if (disabled.length) {
        return ctx.send(`Currently disabled guilds: ${inline(disabled).join(', ')}`);
      } else {
        return ctx.send('No guilds disabled currently.');
      }
    }
  }
}

class EnableUser extends SubCommand {
  public constructor() {
    super({
      name: 'user',
      description: 'Globally enable users from using this bot.',
      usage: '[p]gconfig enable user [...UserID/@User]'
    });
  }

  public async execute(ctx: Context, ...users: string[]) {
    const { inline }: any = ctx.client.utils.format;

    if (users.length) {
      const enabled = [];
      for (const user of users) {
        const found = await ctx.client.utils.djs.resolveUser(ctx.client, user);
        if (!found) continue;
        ctx.client.settings.enableUser(found.id);
        enabled.push(found.tag);
      }

      if (enabled.length) {
        await ctx.client.settings.save();
        return ctx.send(`Successfully enabled users: ${inline(enabled).join(', ')}`);
      } else {
        return ctx.error('No users were enabled. Are you sure you provided the correct names?');
      }
    } else {
      const { disabledUsers: disabled } = ctx.client.settings;
      if (disabled.length) {
        return ctx.send(`Currently disabled users: ${disabled.map(id => `<@${id}>`).join(', ')}`);
      } else {
        return ctx.send(`No users enabled currently.`);
      }
    }
  }
}

class EnableCmd extends SubCommand {
  public constructor() {
    super({
      name: 'cmd',
      description: 'Globally enable commands. Only base commands may be enabled.',
      usage: '[p]gconfig enable cmd [...commands]'
    });
  }

  public async execute(ctx: Context, ...cmds: string[]) {
    const { inline }: any = ctx.client.utils.format;

    if (cmds.length) {
      const enabled = [];
      for (const cmd of cmds) {
        const found = ctx.client.cmdHandler.getBaseCmd(ctx.message, [cmd]);
        if (!found || found[0].chip === 'core') continue;
        ctx.client.settings.enableCommand(cmd);
        enabled.push(cmd);
      }

      if (enabled.length) {
        await ctx.client.settings.save();
        return ctx.success(`Successfully enabled commands:\n${inline(enabled).join('\n')}`);
      } else {
        return ctx.error('No commands were enabled. Are you sure you provided the correct names?');
      }
    } else {
      const { disabledCommands: disabled } = ctx.client.settings;
      if (disabled.length) {
        return ctx.send(`Currently disabled commands: ${inline(disabled).join(', ')}`);
      } else {
        return ctx.send('No commands disabled currently.');
      }
    }
  }
}

const a = new EnableGuild();
const b = new EnableUser();
const c = new EnableCmd();
module.exports = new Enable().register(a, b, c);
