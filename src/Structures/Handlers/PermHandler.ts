import { GuildConfig } from '../../Utils/GuildConfig';
import { Exception } from '../Exceptions/Exception';
import { ExceptionCodes } from '../Exceptions/ExceptionCodes';
import { Command } from '../Command/AbstractCommand';
import {
  Message,
  GuildMember,
  TextChannel,
  PermissionResolvable,
  Permissions,
  Guild,
  User
} from 'discord.js';

export class PermHandler {
  public async checkFilters(cmd: Command, message: Message | any): Promise<void> {
    const { settings: globalConfig, db } = message.client;
    try {
      if (message.author.id === globalConfig.owner) return;
      const errors = [];
      const config: GuildConfig | null = await db.guilds.read(message.guild.id);
      if (config) {
        if (config.disabledUsers.includes(message.author.id)) errors.push('Disabled User [Local]');
        if (config.disabledChannels.includes(message.channel.id)) errors.push('Disabled Channel');
        if (config.disabledCommands.includes(cmd.name)) errors.push('Disabled Command [Local]');
      }
      if (globalConfig.disabledUsers.includes(message.author.id)) errors.push('Disabled User [Global]');
      if (globalConfig.disabledCommands.includes(cmd.name)) errors.push('Disabled Command [Global]');

      const code = ExceptionCodes.FAILED_CUSTOM_FILTERS;
      if (errors.length) return Promise.reject(new Exception(code, errors));
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async checkDiscordPerms(perms: PermissionResolvable, member: GuildMember, channel: TextChannel, checkAdmin: boolean = true): Promise<void> {
    const memberPerms = channel.memberPermissions(member);
    if (!memberPerms) throw new Exception(ExceptionCodes.NOT_FOUND, `Member permissions not found (id: ${member.id})`);

    const missing = memberPerms.missing(perms, checkAdmin);
    if (!missing) return;

    const missingFlags = new Permissions(missing).toArray(checkAdmin);
    const { MISSING_BOT_PERMS, MISSING_MEMBER_PERMS } = ExceptionCodes;
    const code = channel.client.user.id === member.id ? MISSING_BOT_PERMS : MISSING_MEMBER_PERMS;
    throw new Exception(code, missingFlags);
  }

  public checkGuildOwner(guild: Guild, user: User | GuildMember): void {
    if (guild.ownerID === user.id) return;
    throw new Exception(ExceptionCodes.PERMISSION_ERROR, 'Only guild owners may perform that action!');
  }

  public checkBotOwner(user: User | GuildMember | any): void {
    if (user.id === user.client.settings.owner) return;
    throw new Exception(ExceptionCodes.PERMISSION_ERROR, 'Only bot owners may perform that action!');
  }

  public checkBotDev(user: User | GuildMember | any): void {
    if (user.client.settings.devs.includes(user.id)) return;
    throw new Exception(ExceptionCodes.PERMISSION_ERROR, 'Only bot developers may perform that action!');
  }
}
