const { BaseCommand } = require('../../exports');

class GConfig extends BaseCommand {
  constructor() {
    super({
      name: 'gconfig',
      description: 'View or change Citrine\'s global settings.',
      usage: '[p]gconfig',
      chip: 'core'
    });
  }

  async execute(ctx) {
    ctx.lock('botOwner');

    const settings = JSON.stringify(ctx.client.settings.toJSON(), null, '  ');
    try {
        await ctx.author.send(settings, { code: 'json' });
    }
    catch (_) {
        await ctx.send(settings, { code: 'json' });
    } 
  }
}

const p = require('./_gconfig/prefix.js');
const v = require('./_gconfig/verbose.js');
const d = require('./_gconfig/disable.js');
const e = require('./_gconfig/enable.js');
module.exports = new GConfig().registerSubCommands(p, v, d, e);
