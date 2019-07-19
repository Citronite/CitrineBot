import { SubCommand } from '../../../exports';
import Context from '../../../Structures/Utils/Context';

class Disable extends SubCommand {
  public constructor() {
    super({
      name: 'disable',
      description: 'Disable guilds/users/commands globally.',
      usage: '[p]gconfig disable <"guild" | "user" | "cmd">'
    });
  }
}

class DisableGuild extends SubCommand {
  public constructor() {
    super({
      name: 'guild',
      description:
        'Globally disable guilds from using this bot. Only works on guilds the bot can see.',
      usage: '[p]gconfig disable guild [...GuildID/Name]'
    });
  }

  public async execute(ctx: Context, ...guilds: string[]) {
    const { inline }: any = ctx.client.utils.format;

    if (guilds.length) {
      const disabled = [];
      for (const guild of guilds) {
        const found = ctx.client.guilds.find(g => g.name === guild || g.id === guild);
        if (!found) continue;
        ctx.client.settings.disableGuild(found.id);
        disabled.push(found.name);
      }

      if (disabled.length) {
        await ctx.client.settings.save();
        return ctx.success(`Successfully disabled guilds: ${inline(disabled).join(', ')}`);
      } else {
        return ctx.error('No guilds were disabled. Are you sure you provided the correct names?');
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

class DisableUser extends SubCommand {
  public constructor() {
    super({
      name: 'user',
      description:
        'Globally disable users from using this bot. Only works on users the bot can see.',
      usage: '[p]gconfig disable user [...UserID/@User]'
    });
  }

  public async execute(ctx: Context, ...users: string[]) {
    if (users.length) {
      const disabled = [];
      for (const user of users) {
        const found = await ctx.client.utils.djs.resolveUser(ctx.client, user);
        if (!found) continue;
        ctx.client.settings.disableUser(found.id);
        disabled.push(found.tag);
      }

      if (disabled.length) {
        const { inline }: any = ctx.client.utils.format;
        await ctx.client.settings.save();
        return ctx.send(`Successfully disabled users: ${inline(disabled).join(', ')}`);
      } else {
        return ctx.error('No users were disabled. Are you sure you provided the correct names?');
      }
    } else {
      const { disabledUsers: disabled } = ctx.client.settings;
      if (disabled.length) {
        return ctx.send(`Currently disabled Users: ${disabled.map(id => `<@${id}>`).join(', ')}`);
      } else {
        return ctx.send(`No users disabled currently.`);
      }
    }
  }
}

class DisableCmd extends SubCommand {
  public constructor() {
    super({
      name: 'cmd',
      description:
        'Globally disable commands. Only base commands may be disabled. Commands from the `core` chip cannot be disabled.',
      usage: '[p]gconfig disable cmd [...commands]'
    });
  }

  public async execute(ctx: Context, ...cmds: string[]) {
    const { inline }: any = ctx.client.utils.format;

    if (cmds.length) {
      const disabled = [];
      for (const cmd of cmds) {
        const found = ctx.client.cmdHandler.getBaseCmd(ctx.message, [cmd]);
        if (!found || found[0].chip === 'core') continue;
        ctx.client.settings.disableCommand(found[0].name);
        disabled.push(cmd);
      }

      if (disabled.length) {
        await ctx.client.settings.save();
        return ctx.success(`Successfully disabled commands:\n${inline(disabled).join('\n')}`);
      } else {
        return ctx.error('No commands were disabled. Are you sure you provided the correct names?');
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

const a = new DisableGuild();
const b = new DisableUser();
const c = new DisableCmd();
module.exports = new Disable().register(a, b, c);
