import { SubCommand } from '../../../exports';
import Context from '../../../Structures/Utils/Context';

class DisabledRole extends SubCommand {
  public constructor() {
    super({
      name: 'disabledrole',
      description:
        'View or change the disabled role for this server.' +
        'Members with this role will not be able to use bot commands.' +
        'Use `--clear` to clear the disabled role.',
      usage: '[p]config disabledrole [RoleID/@Role/RoleName | "--clear"]'
    });
  }

  public async execute(ctx: Context, role: string) {
    const { guild }: any = ctx;

    const data = await ctx.client.getGuild(ctx.message.guild.id);
    if (!data) throw [404, 'GuildConfig not found!'];

    if (role) {
      if (role === '--clear') {
        data.disabledRole = '';
        await ctx.client.setGuild(ctx.message.guild.id, data);
        return ctx.success('Successfully reset the disabled role');
      } else {
        const parsed = await ctx.client.utils.djs.resolveRole(guild, role);
        if (!parsed) {
          return ctx.error(`Unable to find role \`${role}\``);
        } else {
          data.disabledRole = parsed.id;
          await ctx.client.setGuild(ctx.message.guild.id, data);
          return ctx.success(`Successfully updated the disabled role to \`${parsed.name}\``);
        }
      }
    } else {
      const disabledRole = guild.roles.get(data.disabledRole);
      if (disabledRole) {
        return ctx.send(`The current disabled role is \`${disabledRole.name}\``);
      } else {
        return ctx.send('You have not set up a disabled role for this server yet.');
      }
    }
  }
}

module.exports = new DisabledRole();
