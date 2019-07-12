import GuildConfig from '../Utils/GuildConfig';
import Exception from '../Exceptions/Exception';
import ErrCode from '../Exceptions/ExceptionCodes';
import Context from '../Utils/Context';
import {
  GuildMember,
  TextChannel,
  PermissionResolvable,
  Permissions,
  Guild,
  User
} from 'discord.js';

export default class PermHandler {

  public checkFilters(ctx: Context, config?: GuildConfig): void {
    const { settings: globalConfig } = ctx.client;
    if (ctx.author.id === globalConfig.owner) return;

    const errors = [];
    if (config) {
      if (config.disabledRole) {
        const { member } = ctx;
        if (member && !member.roles.has(config.disabledRole)) errors.push('Disabled Role');
      }
      if (config.disabledUsers.includes(ctx.author.id)) errors.push('Disabled User [Local]');
      if (config.disabledChannels.includes(ctx.channel.id)) errors.push('Disabled Channel');
      if (config.disabledCommands.includes(ctx.command.name))
        errors.push('Disabled Command [Local]');
    }
    const { disabledUsers, disabledCommands } = globalConfig;
    if (disabledUsers.includes(ctx.author.id)) errors.push('Disabled User [Global]');
    if (disabledCommands.includes(ctx.command.name)) errors.push('Disabled Command [Global]');

    const code = ErrCode.FAILED_FILTER_CHECKS;
    if (errors.length) throw new Exception(code, errors);
  }

  public checkPerms(
    perms: PermissionResolvable,
    member: GuildMember,
    channel: TextChannel,
    checkAdmin: boolean = true
  ): void {
    const memberPerms = channel.memberPermissions(member);
    if (!memberPerms)
      throw new Exception(ErrCode.NOT_FOUND, `Member permissions not found (id: ${member.id})`);

    const missing = new Permissions(memberPerms.missing(perms, checkAdmin)).toArray();
    if (!missing || !missing.length) return;

    const { MISSING_BOT_PERMS, MISSING_MEMBER_PERMS } = ErrCode;
    const code = channel.client.user.id === member.id ? MISSING_BOT_PERMS : MISSING_MEMBER_PERMS;
    throw new Exception(code, ['Missing permissions:', ...missing]);
  }

  public checkGuildOwner(guild: Guild, user: User | GuildMember): void {
    if (guild.ownerID === user.id) return;
    throw new Exception(ErrCode.PERMISSION_ERROR, 'Only guild owners may perform that action!');
  }

  public checkBotOwner(user: User | GuildMember): void {
    const client: any = user.client;
    if (user.id === client.settings.owner) return;
    throw new Exception(ErrCode.PERMISSION_ERROR, 'Only bot owners may perform that action!');
  }

  public checkBotDev(user: User | GuildMember): void {
    const client: any = user.client;
    if (client.settings.devs.includes(user.id)) return;
    throw new Exception(ErrCode.PERMISSION_ERROR, 'Only bot developers may perform that action!');
  }
}
