const { BaseCommand, QuickEmbed } = require('../../exports');

class Unload extends BaseCommand {
  constructor() {
    super({
      name: 'unload',
      description: 'Unloads a chip. Separate multiple names with spaces.',
      usage: '[p]unload <...chips>'
    }, 'core');
  }

  async execute(ctx, ...chips) {
    ctx.lock('botOwner');

    const filteredChips = chips.filter(val => allChip.includes(val) && val !== 'core');
    for (const chip of filteredChips) {
        await ctx.client.unloadChip(chip);
    }
    const embed = QuickEmbed.success(`Successfully unloaded chip(s):\n${filteredChips.join('\n')}`);
    await ctx.send(embed);
    return;
    }
}

module.exports = new Unload();
