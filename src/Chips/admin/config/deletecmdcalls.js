const { SubCommand } = require('../../../exports');

class DeleteCmdCalls extends SubCommand {
  constructor() {
    super({
      name: 'deletecmdcalls',
      description: 'Toggle whether commands calls are deleted after being called.',
      usage: '[p]config deletecmdcalls [true | false] [delay (in seconds)]'
    });
  }

  async execute(ctx, setting, delay) {
    const data = await ctx.client.getGuild(ctx.message.guild.id);
    if (setting) {
      setting = JSON.parse(setting);
      if (typeof setting !== 'boolean') {
        ctx.error('Please specify `true` or `false`!');
      } else {
        if (delay) {
          delay = JSON.parse(delay);
          if (typeof delay !== 'number') {
            return ctx.error('The delay must be a number, between 1 and 3600');
          } else {
            data.deleteCmdCallsDelay = delay;
          }
        }
        data.deleteCmdCalls = setting;
        await ctx.client.setGuild(ctx.guild.id, data);
        ctx.success('Successfully updated server settings!');
      }
    } else {
      const { deleteCmdCalls: deleted } = data;
      const { deleteCmdCallsDelay: delay } = data;
      ctx.send(`Delete commands calls: \`${deleted}\`\nDelay: \`${delay}\``);
    }
  }
}

module.exports = new DeleteCmdCalls();
