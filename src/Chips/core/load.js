const { BaseCommand } = require('../../exports');
const { promisify } = require('util');
const { readdir } = require('fs');
const { resolve } = require('path');

const readdirAsync = promisify(readdir);
const root = resolve(`${__dirname}/../../../`);

class Load extends BaseCommand {
  constructor() {
    super({
      name: 'load',
      description:
        'Loads a chip. Separate multiple names with spaces, or enter `all` to load all. Optionally, add the `--re` flag to hot-reload chips',
      usage: '[p]load <...chips | "all"> [--re]',
      chip: 'core'
    });
  }

  async execute(ctx, ...chips) {
    ctx.lock('botOwner');
    if (!chips.length) throw 'INSUFFICIENT_ARGS';

    const allChips = await readdirAsync(`${root}/bin/Chips`);
    const filteredChips = chips.includes('all')
      ? allChips
      : chips.filter(name => allChips.includes(name));
    const reload = chips.includes('--re');
    const loaded = [];
    for (const chip of filteredChips) {
      try {
        if (reload) await ctx.client.clearChipCache(chip);
        await ctx.client.loadChip(chip);
        loaded.push(chip);
      } catch (err) {
        continue;
      }
    }
    if (loaded.length) {
      const { inline } = ctx.client.utils.format;
      await ctx.success(
        `Successfully loaded chip(s):\n${inline(loaded).join('\n')}`
      );
    } else {
      await ctx.error(
        'No chips were loaded. Are you sure you provided the correct name(s)?'
      );
    }
  }
}

module.exports = new Load();
