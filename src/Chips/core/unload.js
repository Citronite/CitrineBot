const { BaseCommand } = require('../../exports');

class Unload extends BaseCommand {
  constructor() {
    super({
      name: 'unload',
      description: 'Unloads a chip. Separate multiple names with spaces. The `core` chip cannot be unloaded.',
      usage: '[p]unload <...chips>'
    }, 'core');
  }

  async execute(ctx, ...chips) {
    ctx.lock('botOwner');

    if (chips.length) {
      const filteredChips = chips.filter(val => val !== 'core');
      const unloaded = [];
      for (const chip of filteredChips) {
          await ctx.client.unloadChip(chip);
          unloaded.push(chip);
      }
      if (unloaded.length) {
        const { inline } = ctx.client.utils.format;
        await ctx.success(`Successfully unloaded chip(s):\n${inline(unloaded).join('\n')}`);
      }
      else {
        await ctx.error(`No chips were unloaded. Are you sure you provided the correct name(s)?`);
      }
    }
    else {
      throw 'INSUFFICIENT_ARGS';
    }
  }
}

module.exports = new Unload();
