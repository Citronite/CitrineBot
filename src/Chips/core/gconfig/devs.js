const { SubCommand } = require('../../../exports');

class Devs extends SubCommand {
  constructor() {
    super({
      name: 'devs',
      description: 'View or edit the list of bot developers.',
      usage: '[p]gconfig devs ["add" | "remove"]'
    });
  }

  async execute(ctx) {
    if (!ctx.subcommand) {
      const devs = ctx.client.settings.devs.map(v => `<@${v}>`);
      ctx.send(`Current list of bot developers:\n${devs.join(', ')}`);
    }
  }
}

class Add extends SubCommand {
  constructor() {
    super({
      name: 'add',
      description:
        'Add users as bot developers. Be careful, as this will give them extra permissions to call developer-only commands!',
      usage: '[p]gconfig devs add [...UserID/@User]'
    });
  }

  async execute(ctx, ...users) {
    const { inline } = ctx.client.utils.format;

    if (users.length) {
      const added = [];
      for (const user of users) {
        const found = await ctx.client.utils.djs.resolveUser(ctx.client, user);
        if (!found) continue;
        ctx.client.settings.addDev(found.id);
        added.push(found.tag);
      }

      if (added.length) {
        await ctx.client.settings.save();
        return ctx.success(`Successfully added bot developer(s):\n${inline(added).join(', ')}`);
      } else {
        return ctx.error('No users were added. Are you sure you provided the correct name?');
      }
    } else {
      ctx.subcommand = undefined;
      await this.parent.execute(ctx);
    }
  }
}

class Remove extends SubCommand {
  constructor() {
    super({
      name: 'remove',
      description: 'Remove users as bot developers.',
      usage: '[p]gconfig devs remove [...UserID/@User]'
    });
  }

  async execute(ctx, ...users) {
    const { inline } = ctx.client.utils.format;

    if (users.length) {
      const removed = [];
      for (const user of users) {
        const found = await ctx.client.utils.djs.resolveUser(ctx.client, user);
        if (!found) continue;
        ctx.client.settings.removeDev(found.id);
        removed.push(found.tag);
      }

      if (removed.length) {
        await ctx.client.settings.save();
        ctx.success(`Successfully removed bot developer(s):\n${inline(removed).join(', ')}`);
      } else {
        return ctx.error('No users were removed. Are you sure you provided the correct names?');
      }
    } else {
      ctx.subcommand = undefined;
      await this.parent.execute(ctx);
    }
  }
}

const a = new Add();
const b = new Remove();
module.exports = new Devs().register(a, b);
