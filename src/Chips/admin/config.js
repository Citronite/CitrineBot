const { BaseCommand } = require('../../exports');

class Config extends BaseCommand {
  constructor() {
    super({
      name: 'config',
      description: 'View or change server settings.',
      usage: '[p]config [-dm]',
      chip: 'admin'
    });
  }

  async execute(ctx, flag) {
    ctx.lockPerms(['ADMINISTRATOR'], { checkBot: false });
    if (ctx.subcommand) return;

    const data = await ctx.client.db.guilds.read(ctx.message.guild.id);
    const settings = JSON.stringify(data, null, '  ');
    const dm = flag === '-dm';
    if (dm) await ctx.sendDM(settings, { code: 'json' });
    else await ctx.send(settings, { code: 'json' });
  }
}

module.exports = new Config()
