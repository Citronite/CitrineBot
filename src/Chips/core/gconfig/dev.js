const { SubCommand } = require('../../../exports');

class Devs extends SubCommand {
  constructor() {
    super({
      name: 'devs',
      description: "View or edit the list of bot developers.",
      usage: '[p]gconfig devs ["add" | "remove"]'
    });
  }

  async execute(ctx) {
    if (!ctx.subcommand) {
        const devs = ctx.client.settings.devs.map(v => `<@${v}>`);
        ctx.send(`Current list of bot developers: ${devs.join(', ')}`);
    }
  }
}

class Add extends SubCommand {
    constructor() {
        super({
            name: 'add',
            description: 'Add users as bot developers. Be careful, as this will give them extra permissions to call developer-only commands!',
            usage: '[p]gconfig devs add [...UserID/@User]'
        });
    }

    async execute(ctx, ...users) {
        if (users.length) {
            for (const user of users) {
                ctx.client.settings.addDev(user);
            }
            const added = users.map(v => `<@${v}>`);
            ctx.success(`Successfully added bot developers: ${added.join(', ')}`)
        } else {
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
      if (users.length) {
          for (const user of users) {
              ctx.client.settings.removeDev(user);
          }
          const added = users.map(v => `<@${v}>`);
          ctx.success(`Successfully removed bot developers: ${added.join(', ')}`)
      } else {
        await this.parent.execute(ctx);
      }
  }
}

const a = new Add();
const r = new Remove();
module.exports = new Devs().registerSubCommands(a, r);
