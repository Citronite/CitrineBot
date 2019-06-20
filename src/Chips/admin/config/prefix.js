const { SubCommand } = require('../../../exports');

class Prefix extends SubCommand {
  constructor() {
    super({
      name: 'prefix',
      description: 'View or change server prefix.',
      usage: '[p]config prefix [new prefix]'
    });
  }

  async execute(ctx, newPrefix) {
    const data = await ctx.client.getGuild(ctx.message.guild.id);
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
