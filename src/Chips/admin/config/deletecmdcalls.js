const { SubCommand } = require('../../../exports');

class DeleteCmdCalls extends SubCommand {
  constructor() {
    super({
      name: 'deletecmdcalls',
      description: 'Toggle whether commands calls are deleted after being called.',
      usage: '[p]config deletecmdcalls [on | off] [delay (in seconds)]'
    });
  }

  async execute(ctx, setting, delay) {
    const data = await ctx.client.getGuild(ctx.message.guild.id);
    if (setting) {
      setting = setting.toLowerCase();
      if (!['on', 'off'].includes(setting)) {
        ctx.error('Please specify `on` or `off`');
      } else {
        if (delay) {
          delay = JSON.parse(delay);
          if (typeof delay !== 'number' || delay > 3600 || delay < 1) {
            return ctx.error('The delay must be a number, between 1 and 3600');
          } else {
            data.deleteCmdCallsDelay = delay * 1000;
          }
        }
        data.deleteCmdCalls = setting === 'on' ? true : false;
        await ctx.client.setGuild(ctx.guild.id, data);
        ctx.success('Successfully updated server settings!');
      }
    } else {
      const { deleteCmdCalls: deleted } = data;
      const { deleteCmdCallsDelay: delay } = data;
      ctx.send(
        `Delete commands calls: \`${deleted ? 'ON' : 'OFF'}\`\nDelay: \`${delay / 1000} seconds\``
      );
    }
  }
}

module.exports = new DeleteCmdCalls();
