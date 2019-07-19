import { SubCommand } from '../../../exports';
import Context from '../../../Structures/Utils/Context';

class Verbose extends SubCommand {
  public constructor() {
    super({
      name: 'verbose',
      description: 'View or toggle verbose mode setting.',
      usage: '[p]gconfig verbose ["on" | "off"]'
    });
  }

  public async execute(ctx: Context, choice: string) {
    if (choice) {
      choice = choice.toLowerCase();
      if (!['on', 'off'].includes(choice)) {
        return ctx.error('Please specify `on` or `off`');
      } else {
        ctx.client.settings.verbose = choice === 'on' ? true : false;
        await ctx.client.settings.save();
        return ctx.success(`Verbose mode is now \`${choice.toUpperCase()}\``);
      }
    } else {
      return ctx.send(
        `Verbose mode is currently \`${ctx.client.settings.verbose ? 'ON' : 'OFF'}\``
      );
    }
  }
}

module.exports = new Verbose();
