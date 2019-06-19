import { GuildConfig } from '../../Utils/GuildConfig';
import { Exception } from '../Exceptions/Exception';
import { ExceptionCodes } from '../Exceptions/ExceptionCodes';
import { Context } from '../../Utils/Context';
import {
  GuildMember,
  TextChannel,
  PermissionResolvable,
  Permissions,
  Guild,
  User
} from 'discord.js';

const ErrCode = ExceptionCodes;

export class PermHandler {
  public checkFilters(ctx: Context, config?: GuildConfig): void {
    const { settings: globalConfig } = ctx.client;
    if (ctx.author.id === globalConfig.owner) return;

    const errors = [];
    if (config) {
      if (config.disabledUsers.includes(ctx.author.id))
        errors.push('Disabled User [Local]');
      if (config.disabledChannels.includes(ctx.channel.id))
        errors.push('Disabled Channel');
      if (config.disabledCommands.includes(ctx.command.name))
        errors.push('Disabled Command [Local]');
    }
    if (globalConfig.disabledUsers.includes(ctx.author.id))
      errors.push('Disabled User [Global]');
    if (globalConfig.disabledCommands.includes(ctx.command.name))
      errors.push('Disabled Command [Global]');

    const code = ErrCode.FAILED_CUSTOM_FILTERS;
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
      throw new Exception(
        ErrCode.NOT_FOUND,
        `Member permissions not found (id: ${member.id})`
      );

    const missing = new Permissions(
      memberPerms.missing(perms, checkAdmin)
    ).toArray();
    if (!missing || !missing.length) return;

    const { MISSING_BOT_PERMS, MISSING_MEMBER_PERMS } = ExceptionCodes;
    const code =
      channel.client.user.id === member.id
        ? MISSING_BOT_PERMS
        : MISSING_MEMBER_PERMS;
    throw new Exception(code, ['Missing permissions:', ...missing]);
  }

  public checkGuildOwner(guild: Guild, user: User | GuildMember): void {
    if (guild.ownerID === user.id) return;
    throw new Exception(
      ErrCode.PERMISSION_ERROR,
      'Only guild owners may perform that action!'
    );
  }

  public checkBotOwner(user: User | GuildMember): void {
    const client: any = user.client;
    if (user.id === client.settings.owner) return;
    throw new Exception(
      ErrCode.PERMISSION_ERROR,
      'Only bot owners may perform that action!'
    );
  }

  public checkBotDev(user: User | GuildMember): void {
    const client: any = user.client;
    if (client.settings.devs.includes(user.id)) return;
    throw new Exception(
      ErrCode.PERMISSION_ERROR,
      'Only bot developers may perform that action!'
    );
  }
}
