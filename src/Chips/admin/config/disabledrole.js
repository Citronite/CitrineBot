const { SubCommand } = require('../../../exports');

class DisabledRole extends SubCommand {
  constructor() {
    super({
      name: 'disabledrole',
      description:
        'View or change the disabled role for this server. Members with this role will not be able to use bot commands.',
      usage: '[p]config disabledrole [RoleID / @Role / role name]'
    });
  }

  async execute(ctx, role) {
    const data = await ctx.client.getGuild(ctx.message.guild.id);
    if (role) {
      const parsed = await ctx.client.utils.djs.resolveRole(ctx.guild, role);
      if (!parsed) {
        ctx.error(`Unable to find role \`${role}\``);
      } else {
        data.disabledRole = parsed.id;
        await ctx.client.setGuild(ctx.message.guild.id, data);
        ctx.success(`Successfully updated the disabled role to \`${parsed.name}\``);
      }
    } else {
      const disabledRole = ctx.guild.roles.get(data.disabledRole);
      if (disabledRole) {
        ctx.send(`The current disabled role is \`${disabledRole.name}\``);
      } else {
        ctx.send('You have not set up a disabled role for this server yet!');
      }
    }
  }
}

module.exports = new DisabledRole();
