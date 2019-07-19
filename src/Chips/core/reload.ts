import { BaseCommand } from '../../exports';
import Context from '../../Structures/Utils/Context';

class Reload extends BaseCommand {
  public constructor() {
    super({
      name: 'reload',
      description:
        'Reloads a chip. Separate multiple names with spaces, or enter `all` to reload all. ' +
        'This command will only work for loaded chips.',
      usage: '[p]reload <...chips | "all">',
      chip: 'core'
    });
  }

  public async execute(ctx: Context, ...chips: string[]) {
    ctx.lock('botOwner');
    if (!chips.length) throw 'INSUFFICIENT_ARGS';

    const reloaded = [];
    const { loadedChips } = ctx.client.settings;
    const filteredChips = chips.includes('all')
      ? loadedChips
      : chips.filter(name => loadedChips.includes(name));

    for (const chip of filteredChips) {
      try {
        await ctx.client.clearChipCache(chip);
        await ctx.client.unloadChip(chip);
        await ctx.client.loadChip(chip);
        reloaded.push(chip);
      } catch (err) {
        ctx.client.logger.error(err);
      }
    }

    if (reloaded.length) {
      const { inline }: any = ctx.client.utils.format;
      return ctx.success(`Successfully reloaded chip(s):\n${inline(reloaded).join(', ')}`);
    } else {
      return ctx.error('No chips were reloaded. Are you sure you provided the correct name(s)?');
    }
  }
}

module.exports = new Reload();
