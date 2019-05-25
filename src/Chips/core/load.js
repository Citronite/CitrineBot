const { BaseCommand } = require('../../exports');
const { promisify } = require('util');
const { readdir } = require('fs');

const readdirAsync = promisify(readdir);
function fileFilter(arr) {
  return arr.filter(val => !val.startsWith('_') && val.endsWith('.js'));
}

class Load extends BaseCommand {
  constructor() {
    super({
      name: 'load',
      description: 'Loads a chip. Separate multiple names with spaces, or enter `all` to load all. Optionally, add the `-re` flag to hot-reload chips',
      usage: '[p]load <...chips | "all"> [-re]'
    }, 'core');
  }

  async execute(ctx, ...chips) {
    ctx.lock('botOwner');

    if (chips.length) {
      const allChips = await readdirAsync('./bin/Chips');
      const filteredChips = chips.includes('all') ? allChips : chips.filter(name => allChips.includes(name));
      const reload = chips.includes('-re');
      const loaded = [];
      for (const chip of filteredChips) {
          if (reload) {
              await ctx.client.clearCachedChip(chip);
          }
          await ctx.client.loadChip(chip);
          loaded.push(chip);
      }
      if (loaded.length) {
        await ctx.success(`Successfully loaded chip(s):\n${loaded.join('\n')}`);
      }
      else {
        await ctx.error('No chips were loaded. Are you sure you provided the correct name(s)?');
      }
    }
    else {
      throw 'INSUFFICIENT_ARGS';
    }
  }
}

module.exports = new Load();
