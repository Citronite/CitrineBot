import Context from "../../Structures/Utils/Context";
import { BaseCommand } from '../../exports';

class GConfig extends BaseCommand {
  public constructor() {
    super({
      name: 'gconfig',
      description: "View or change Citrine's global settings.",
      usage: '[p]gconfig [--dm]',
      chip: 'core'
    });
  }

  public async execute(ctx: Context, flag: string) {
    ctx.lock('botOwner');
    if (ctx.subcommand) return;

    const settings = JSON.stringify(ctx.client.settings.toJSON(), null, '  ');
    const dm = flag === '--dm';
    if (dm) await ctx.sendDM(settings, { code: 'json' });
    else await ctx.send(settings, { code: 'json' });
  }
}

const a = require('./gconfig/prefix.js');
const b = require('./gconfig/verbose.js');
const c = require('./gconfig/disable.js');
const d = require('./gconfig/enable.js');
const e = require('./gconfig/aliases.js');
const f = require('./gconfig/devs.js');
module.exports = new GConfig().register(a, b, c, d, e, f);
