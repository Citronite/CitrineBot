import { QuickEmbed } from './QuickEmbed';
import { CitrineClient } from '../Structures/CitrineClient';
import { BaseError } from '../Structures/ErrorStructs/BaseError';
import { ErrorMessages } from '../Structures/ErrorStructs/ErrorMessages';
import { GuildConfig } from './GuildConfig';
import { LockOptions, Reaction } from 'typings';
import {
  Message,
  User,
  TextChannel,
  DMChannel,
  GroupDMChannel,
  MessageReaction,
  Emoji,
  ReactionEmoji,
  PermissionResolvable,
  GuildMember,
  Guild
} from 'discord.js';

export class Context {
  public readonly client: CitrineClient | any;
  public readonly prefix: string;
  public readonly message: Message;
  public readonly author: User;
  public readonly member: GuildMember | null;
  public readonly channel: TextChannel | DMChannel | GroupDMChannel;
  public readonly guild: Guild | null;

  constructor(message: Message, iPrefix: string) {
    this.client = message.client;
    // The prefix used to invoke the command.
    // If it was a bot mention, then this will be the global prefic for the bot.
    this.prefix = iPrefix;
    this.message = message;
    this.author = message.author;
    this.member = message.member || null;
    this.channel = message.channel;
    this.guild = message.guild || null;
  }

  public async success(msg: string, embed: boolean = true): Promise<Message | Message[]> {
    if (embed) {
      const embed = QuickEmbed.success(msg);
      return this.channel.send(embed);
    } else {
      return this.channel.send(`✅ ${msg}`);
    }
  }

  public async error(msg: string, embed: boolean = true): Promise<Message | Message[]> {
    if (embed) {
      const embed = QuickEmbed.error(msg);
      return this.channel.send(embed);
    } else {
      return this.channel.send(`⛔ ${msg}`);
    }
  }

  public async confirm(msg: string, timeOut: number = 30000): Promise<boolean | null> {
    // Use reactions instead of yes/no replies bc why not :P
    return Promise.reject('Not Implemented');
  }

  public async prompt(msg: string, contentOnly: boolean = true, timeOut: number = 30000): Promise<Message | string | null> {
    // contentOnly specifies whether this function will return only the content of the answer, or
    // the entire Message object from the user.
    return Promise.reject('Not Implemented');
  }

  public async promptReaction(msg: string, emojis: Reaction[], limit: number = 1, timeOut: number = 30000): Promise<MessageReaction[] | null> {
    return Promise.reject('Not Implemented');
    // Waits for a reaction on the bot message.
    // First param would be msg to send, second param list of reactions to await.
    // Limit is number of reactions to wait for.
  }

  public async send(...args: any): Promise<Message | Message[]> {
    return this.channel.send(...args);
  }

  public async reply(...args: any): Promise<Message | Message[]> {
    return this.message.reply(...args);
  }

  public async sendDM(...args: any): Promise<Message | Message[]> {
    return this.author.send(...args);
  }

  public checkPerms(perms: PermissionResolvable, checkBot: boolean = true, checkAdmin: boolean = true): void {
    const { checkDiscordPerms } = this.client.permHandler;

    if (!this.member) {
      throw new BaseError(100, 'Permission checks will only work on guild members, not users!');
    }

    checkDiscordPerms(this.channel, this.member, perms, checkAdmin);

    if (checkBot) {
      if (!this.guild) {
        throw new BaseError(100, 'Permission checks will only work inside guilds!');
      }
      checkDiscordPerms(this.channel, this.guild.me, perms, checkAdmin);
    }
  }

  public checkBotDev(): void {
    if (this.client.settings.devs.includes(this.author.id)) return;
    throw new BaseError(100, 'Only bot developers may perform this action!');
  }

  public checkBotOwner(): void {
    if (this.client.settings.owner === this.author.id) return;
    throw new BaseError(100, 'Only bot owners may perform this action!');
  }

  public lock(condition: boolean, lockOptions?: LockOptions): void {
    if (condition) return;

    // 100 === ErrorCodes.PERMISSION_ERROR
    const options = {
      errCode: lockOptions && lockOptions.errCode || 100,
      errMessage: lockOptions && lockOptions.errMessage || ErrorMessages[100]
    };
    throw new BaseError(options.errCode, options.errMessage);
  }
}
