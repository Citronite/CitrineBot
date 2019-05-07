import { QuickEmbed } from './QuickEmbed';
import { CitrineClient } from '../Structures/CitrineClient';
import { Exception } from '../Structures/ErrorStructs/Exception';
import { ExceptionMessages } from '../Structures/ErrorStructs/ExceptionMessages';
import { LockOption, Reaction } from 'typings';
import {
  Message,
  User,
  TextChannel,
  DMChannel,
  GroupDMChannel,
  MessageReaction,
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
    this.channel = message.channel;
    this.member = message.member || null;
    this.guild = message.guild || null;
  }

  public async send(...args: any): Promise<Message | Message[]> {
    return this.channel.send(...args);
  }

  public async sendDM(...args: any): Promise<Message | Message[]> {
    try {
      const res = await this.author.send(...args);
      return res;
    } catch (err) {
      return this.channel.send('Failed to send DM. Please make sure your DMs are enabled.');
    }
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

  // contentOnly specifies whether this function will return
  // the entire Message object or just message.content
  public async prompt(msg: string, contentOnly: boolean = true, timeOut: number = 30000): Promise<Message | string | null> {
    return Promise.reject('This feature is yet to be implemented!');
  }

  // Waits for a reaction on the bot message.
  // First param would be msg to send, second param list of reactions to await.
  // Limit is number of reactions to wait for.
  public async promptReaction(msg: string, emojis: Reaction[], limit: number = 1, timeOut: number = 30000): Promise<MessageReaction[] | null> {
    return Promise.reject('This feature is yet to be implemented!');
  }

  public lockPerms(perms: PermissionResolvable, checkBot: boolean = true, checkAdmin: boolean = true): void {
    const { checkDiscordPerms } = this.client.permHandler;
    if (!this.member) {
      throw new Exception(100, 'Permission checks only work on guild members, not users!');
    }
    if (!this.guild) {
      throw new Exception(100, 'Permission checks only work inside guilds!');
    }

    checkDiscordPerms(this.channel, this.member, perms, checkAdmin);
    if (checkBot) checkDiscordPerms(this.channel, this.guild.me, perms, checkAdmin);
  }

  public lock(...locks: LockOption[]): void {
    for (const lock of locks) {
      if (typeof lock === 'boolean') {
        // 100 === ExceptionCodes.PERMISSION_ERROR
        if (lock) continue;
        throw new Exception(100, ExceptionMessages[100]);
      } else {
        switch (lock) {
          case 'botOwner':
            if (this.client.settings.owner === this.author.id) continue;
            throw new Exception(100, 'Only the bot owner may perform this action!');
          case 'botDev':
            if (this.client.settings.devs.includes(this.author.id)) continue;
            throw new Exception(100, 'Only bot developers may perform this action!');
          case 'dm':
            if (this.message.channel.type === 'dm') continue;
            throw new Exception(100, 'This command can only be used in DM channels!');
          case 'guild':
            if (this.guild) continue;
            throw new Exception(100, 'This command can only be used in guild channels!');
          default:
            throw new Error('Invalid LockOption provided!');
        }
      }
    }
  }
}
