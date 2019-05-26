const { BaseCommand } = require('../../exports');

class GConfig extends BaseCommand {
  constructor() {
    super({
      name: 'gconfig',
      description: 'Change Citrine\'s global settings. If 0 arguments are provided, it will list current settings. If 1 argument is provided, it will list the current settings for the given argument.',
      usage: '[p]gconfig [setting] [new value]'
    }, 'core');
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

module.exports = new GConfig().registerSubCommands(p);