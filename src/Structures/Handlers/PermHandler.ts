import { GuildConfig } from '../../Utils/GuildConfig';
import { BaseError } from '../ErrorStructs/BaseError';
import { ErrorCodes } from '../ErrorStructs/ErrorCodes';
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
  constructor() {
    throw new Error('This class may not be instantiated with the new keyword!');
  }

  public static async checkCustomFilters(cmd: Command, message: Message | any): Promise<boolean> {
    const { settings: globalConfig, db } = message.client;
    try {
      const errors = [];
      const config: GuildConfig | null = await db.getGuild(message.guild.id);
      if (config) {
        if (config.disabledUsers.includes(message.author.id)) errors.push('Disabled User [Local]');
        if (config.disabledChannels.includes(message.channel.id)) errors.push('Disabled Channel');
        if (config.disabledCommands.includes(cmd.name)) errors.push('Disabled Command [Local]');
      }
      if (message.author.id === globalConfig.owner) return Promise.resolve(true);
      if (globalConfig.disabledUsers.includes(message.author.id)) errors.push('Disabled User [Global]');
      if (globalConfig.disabledCommands.includes(cmd.name)) errors.push('Disabled Command [Global]');

      return errors.length ? Promise.reject(new BaseError(ErrorCodes.FAILED_CUSTOM_FILTERS, errors)) : Promise.resolve(true);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public static checkDiscordPerms(channel: TextChannel, member: GuildMember, perms: PermissionResolvable, checkAdmin: boolean = true): void {
    const memberPerms = channel.memberPermissions(member);
    if (memberPerms === null) throw new BaseError(ErrorCodes.NOT_FOUND, `Member permissions not found (id: ${member.id})`);

    const missing = memberPerms.missing(perms, checkAdmin);
    if (!missing) return;

    const missingFlags = new Permissions(missing).toArray(checkAdmin);
    const code = channel.client.user.id === member.id ? ErrorCodes.MISSING_BOT_PERMS : ErrorCodes.MISSING_MEMBER_PERMS;
    throw new BaseError(code, missingFlags);
  }

  public static checkGuildOwner(guild: Guild, user: User | GuildMember): void {
    if (guild.ownerID === user.id) return;
    throw new BaseError(ErrorCodes.PERMISSION_ERROR, 'Only guild owners may perform that action!');
  }

  public static checkBotOwner(user: User | GuildMember | any): void {
    if (user.id === user.client.settings.owner) return;
    throw new BaseError(ErrorCodes.PERMISSION_ERROR, 'Only bot owners may perform that action!');
  }

  public static checkBotDev(user: User | GuildMember | any): void {
    if (user.client.settings.devs.includes(user.id)) return;
    throw new BaseError(ErrorCodes.PERMISSION_ERROR, 'Only bot developers may perform that action!');
  }

}
