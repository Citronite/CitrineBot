import { GuildConfig } from '../../Utils/GuildConfig';
import { Exception } from '../ErrorStructs/Exception';
import { ExceptionCodes } from '../ErrorStructs/ExceptionCodes';
import { Command } from '../CommandStructs/AbstractCommand';
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

  public async checkCustomFilters(cmd: Command, message: Message | any): Promise<boolean> {
    const { settings: globalConfig, db } = message.client;
    try {
      if (message.author.id === globalConfig.owner) return Promise.resolve(true);
      const errors = [];
      const config: GuildConfig | null = await db.guilds.read(message.guild.id);
      if (config) {
        if (config.disabledUsers.includes(message.author.id)) errors.push('Disabled User [Local]');
        if (config.disabledChannels.includes(message.channel.id)) errors.push('Disabled Channel');
        if (config.disabledCommands.includes(cmd.name)) errors.push('Disabled Command [Local]');
      }
      if (globalConfig.disabledUsers.includes(message.author.id)) errors.push('Disabled User [Global]');
      if (globalConfig.disabledCommands.includes(cmd.name)) errors.push('Disabled Command [Global]');

      return errors.length ? Promise.reject(new Exception(ExceptionCodes.FAILED_CUSTOM_FILTERS, errors)) : Promise.resolve(true);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public checkDiscordPerms(perms: PermissionResolvable, member: GuildMember, channel: TextChannel, checkAdmin: boolean = true): void {
    const memberPerms = channel.memberPermissions(member);
    if (!memberPerms) throw new Exception(ExceptionCodes.NOT_FOUND, `Member permissions not found (id: ${member.id})`);

    const missing = memberPerms.missing(perms, checkAdmin);
    if (!missing) return;

    const missingFlags = new Permissions(missing).toArray(checkAdmin);
    const code = channel.client.user.id === member.id ? ExceptionCodes.MISSING_BOT_PERMS : ExceptionCodes.MISSING_MEMBER_PERMS;
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
