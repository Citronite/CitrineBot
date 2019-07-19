import { BaseCommand } from '../../exports';
import Context from '../../Structures/Utils/Context';

class Unload extends BaseCommand {
  public constructor() {
    super({
      name: 'unload',
      description:
        'Unloads a chip. Separate multiple names with spaces. ' +
        'The `core` chip cannot be unloaded.',
      usage: '[p]unload <...chips>',
      chip: 'core'
    });
  }

  public async execute(ctx: Context, ...chips: string[]) {
    ctx.lock('botOwner');
    if (!chips.length) throw 'INSUFFICIENT_ARGS';

    const unloaded = [];
    const { loadedChips } = ctx.client.settings;
    const filteredChips = chips.includes('all')
      ? loadedChips
      : chips.filter(name => loadedChips.includes(name));

    for (const chip of filteredChips) {
      try {
        if (chip === 'core') continue;
        await ctx.client.unloadChip(chip);
        unloaded.push(chip);
      } catch (err) {
        ctx.client.logger.error(err);
      }
    }

    if (unloaded.length) {
      const { inline }: any = ctx.client.utils.format;
      return ctx.success(`Successfully unloaded chip(s):\n${inline(unloaded).join(', ')}`);
    } else {
      return ctx.error('No chips were unloaded. Are you sure you provided the correct name(s)?');
    }
  }
}

module.exports = new Unload();
