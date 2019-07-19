import { SubCommand } from '../../../exports';
import Context from '../../../Structures/Utils/Context';

class ReadMsgEdits extends SubCommand {
  public constructor() {
    super({
      name: 'readmsgedits',
      description: 'Toggle whether to read edited messages for commands.',
      usage: '[p]config readmsgedits [on | off]'
    });
  }

  public async execute(ctx: Context, setting: string) {
    const { guild }: any = ctx;
    const data = await ctx.client.getGuild(guild.id);
    if (!data) throw [404, 'GuildConfig not found!'];

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
