const { BaseCommand, QuickEmbed } = require('../../exports');
const { promisify } = require('util');
const { readdir } = require('fs');

const readdirAsync = promisify(readdir);

class Load extends BaseCommand {
  constructor() {
    super({
      name: 'load',
      description: 'Loads a chip. Separate multiple names with spaces, or enter `all` to load all. Optionally, add the `-re` flag to reload/update chips',
      usage: '[p]load <...chips | "all"> [-re]'
    }, 'core');
  }

  async execute(ctx, ...chips) {
    ctx.lock('botOwner');

    const allChips = await readdirAsync('./bin/Chips');
    let filteredChips = chips.includes('all') ? allChips : chips.filter(name => allChips.includes(name));
    for (const chip of filteredChips) {
        if (chips.includes('-re')) {
            await ctx.client.clearCachedChip(chip);
        }
        await ctx.client.loadChip(chip);
    }
    const embed = QuickEmbed.success(`Successfully loaded chip(s):\n${filteredChips.join('\n')}`);
    await ctx.send(embed);
    return;
    }
}

module.exports = new Load();
