const { SubCommand } = require('../../../exports');

class ReadMsgEdits extends SubCommand {
  constructor() {
    super({
      name: 'readmsgedits',
      description: 'Toggle whether to read edited messages for commands.',
      usage: '[p]config readmsgedits [on | off]'
    });
  }

  async execute(ctx, setting) {
    const data = await ctx.client.getGuild(ctx.message.guild.id);
    if (setting) {
      setting = setting.toLowerCase();
      if (!['on', 'off'].includes(setting)) {
        ctx.error('Please specify `on` or `off`');
      } else {
        data.readMsgEdits = setting === 'on' ? true : false;
        await ctx.client.setGuild(ctx.message.guild.id, data);
        ctx.success('Successfully updated server settings!');
      }
    } else {
      const { readMsgEdits } = data;
      ctx.send(`Read message edits: \`${readMsgEdits ? 'ON' : 'OFF'}\``);
    }
  }
}

module.exports = new ReadMsgEdits();
