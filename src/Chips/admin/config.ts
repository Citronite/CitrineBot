import { BaseCommand } from '../../exports';
import Context from '../../Structures/Utils/Context';

class Config extends BaseCommand {
  public constructor() {
    super({
      name: 'config',
      description: 'View or change server settings.',
      usage: '[p]config [--dm]',
      chip: 'admin'
    });
  }

  public async execute(ctx: Context, flag: string) {
    ctx.lock('guild', 'guildOwner');
    if (ctx.subcommand) return;

    const data = await ctx.client.getGuild(ctx.message.guild.id);
    const settings = JSON.stringify(data, null, '  ');
    const dm = flag === '--dm';
    if (dm) await ctx.sendDM(settings, { code: 'json' });
    else await ctx.send(settings, { code: 'json' });
  }
}

const a = require('./config/prefix.js');
const b = require('./config/disabledrole.js');
const c = require('./config/deletecmdcalls.js');
const d = require('./config/enable.js');
const e = require('./config/disable.js');
const f = require('./config/readmsgedits.js');
module.exports = new Config().register(a, b, c, d, e, f);
