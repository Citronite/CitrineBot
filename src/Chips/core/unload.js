const { BaseCommand } = require('../../exports');

class Unload extends BaseCommand {
  constructor() {
    super({
      name: 'unload',
      description:
        'Unloads a chip. Separate multiple names with spaces. The `core` chip cannot be unloaded. Provide the `--cc` flag to clear the chip from the cache.',
      usage: '[p]unload <...chips> [--cc]',
      chip: 'core'
    });
  }

  async execute(ctx, ...args) {
    ctx.lock('botOwner');
    if (!args.length) throw 'INSUFFICIENT_ARGS';

    const { loadedChips: loaded } = ctx.client.settings;
    const clearCache = args.includes('--cc');
    const unloaded = [];
    const failed = [];
    if (args.includes('all')) args = loaded;

    for (const chip of args) {
      if (chip === 'core') continue;
      if (!loaded.includes(chip)) continue;
      try {
        if (clearCache) await ctx.client.clearChipCache(chip);
        await ctx.client.unloadChip(chip);
        unloaded.push(chip);
      } catch (err) {
        failed.push(chip);
      }
    }
    const { inline } = ctx.client.utils.format;
    if (failed.length) {
      await ctx.error(
        `Failed to load the following chip(s):\n${inline(failed).join(', ')}`
      );
    }
    if (unloaded.length) {
      await ctx.success(
        `Successfully unloaded chip(s):\n${inline(unloaded).join(', ')}`
      );
    } else {
      await ctx.error(
        'No chips were unloaded. Are you sure you provided the correct name(s)?'
      );
    }
  }
}

module.exports = new Unload();
