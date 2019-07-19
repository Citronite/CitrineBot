import { SubCommand } from '../../../exports';
import Context from '../../../Structures/Utils/Context';

class Prefix extends SubCommand {
  public constructor() {
    super({
      name: 'prefix',
      description: 'View or change server prefix.',
      usage: '[p]config prefix [new prefix]'
    });
  }

  public async execute(ctx: Context, newPrefix: string) {
    const { guild }: any = ctx;
    const data = await ctx.client.getGuild(guild.id);
    if (!data) throw [404, 'GuildConfig not found!'];

    if (newPrefix) {
      data.prefix = newPrefix;
      await ctx.client.setGuild(ctx.message.guild.id, data);
      ctx.success(`Successfully updated the server prefix to \`${newPrefix}\``);
    } else {
      const { prefix } = data;
      ctx.send(`The current server prefix is \`${prefix}\``);
    }
  }
}

module.exports = new Prefix();
