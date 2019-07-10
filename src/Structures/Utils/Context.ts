import QuickEmbed from './QuickEmbed';
import CitrineClient from '../CitrineClient';
import Exception from '../Exceptions/Exception';
import ExceptionMessages from '../Exceptions/ExceptionMessages';
import { Command } from 'typings';
import SubCommand from '../Command/SubCommand';
import {
  LockType,
  LockPermsOptions,
  // PromptOptions,
  // PromptReactionOptions,
  // Reaction,
  ContextData
} from 'typings';

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

function validateContextData(data: any): void {
  if (!data) throw new Error('ContextData is required!');
  if (!data.message) throw new Error('ContextData#message is required!');
  if (!data.prefix) throw new Error('ContextData#prefix is required!');
  if (!data.command) throw new Error('ContextData#cmd is required!');
}

export default class Context {
  public readonly client: CitrineClient;
  public readonly prefix: string;
  public readonly message: Message;
  public readonly author: User;
  public readonly member: GuildMember | null;
  public readonly channel: TextChannel | DMChannel | GroupDMChannel;
  public readonly guild: Guild | null;
  public readonly command: Command;
  public readonly subcommand?: SubCommand;

  public constructor(data: ContextData) {
    validateContextData(data);
    const message: any = data.message;
    const subcmd: any = data.subcommand;
    this.client = message.client;
    this.message = message;
    this.author = message.author;
    this.channel = message.channel;
    this.member = message.member || null;
    this.guild = message.guild || null;
    this.prefix = data.prefix;
    this.command = data.command;
    this.subcommand = subcmd;
  }

  /**
   * Equivalent to ctx.channel.send
   */
  public async send(...args: any): Promise<Message | Message[]> {
    return this.channel.send(...args);
  }

  /**
   * Attempts to send a DM to the message author.
   */
  public async sendDM(...args: any): Promise<Message | Message[]> {
    try {
      const res = await this.author.send(...args);
      return res;
    } catch (_) {
      return this.channel.send('Failed to send DM. Please make sure your DMs are enabled.');
    }
  }

  /**
   * Sends a simple success message.
   */
  public async success(msg: string, embed: boolean = true): Promise<Message | Message[]> {
    if (embed) {
      const embed = QuickEmbed.success(msg);
      return this.channel.send(embed);
    } else {
      return this.channel.send(`✅ ${msg}`);
    }
  }

  /**
   * Sends a simple error message.
   */
  public async error(msg: string, embed: boolean = true): Promise<Message | Message[]> {
    if (embed) {
      const embed = QuickEmbed.error(msg);
      return this.channel.send(embed);
    } else {
      return this.channel.send(`⛔ ${msg}`);
    }
  }

  /**
   * Prompts input from a user.
   */
  public async prompt(/* msg: string, options?: PromptOptions */): Promise<Message | string> {
    return Promise.reject('This feature is yet to be implemented!');
  }

  /**
   * Prompts a reaction from a user.
   */
  public async promptReaction(/* msg: string, emojis: Reaction[], options?: PromptReactionOptions */): Promise<
    MessageReaction
  > {
    return Promise.reject('This feature is yet to be implemented!');
  }

  /**
   * Add permission checks to restrict command usage.
   * If failed, throws an Exception with error code 100.
   */
  public lockPerms(perms: PermissionResolvable, options?: LockPermsOptions): void {
    const { checkPerms } = this.client.permHandler;
    if (!this.member) {
      throw new Exception(100, 'Permission checks only work on guild members!');
    }
    if (!this.guild) {
      throw new Exception(100, 'Permission checks only work inside guilds!');
    }
    if (!(this.channel instanceof TextChannel)) {
      throw new Exception(100, 'Permission checks only work inside guilds!');
    }

    const opts = Object.assign(
      {
        checkBot: true,
        checkAdmin: true
      },
      options
    );

    checkPerms(perms, this.member, this.channel, opts.checkAdmin);
    if (opts.checkBot) checkPerms(perms, this.guild.me, this.channel, opts.checkAdmin);
  }

  /**
   * Add custom checks to restrict command usage.
   * If failed, throws an Exception with error code 100.
   */
  public lock(...locks: LockType[]): void {
    for (const lock of locks) {
      if (typeof lock === 'boolean') {
        if (lock) continue;
        throw new Exception(100, ExceptionMessages[100]);
      } else {
        switch (lock) {
          case 'guildOwner':
            if (this.guild && this.guild.ownerID === this.author.id) continue;
            throw new Exception(100, 'Only guild owners may perform this action!');

          case 'botOwner':
            if (this.client.settings.owner === this.author.id) continue;
            throw new Exception(100, 'Only the bot owner may perform this action!');

          case 'botDev':
            if (this.client.settings.devs.includes(this.author.id)) continue;
            throw new Exception(100, 'Only bot developers may perform this action!');

          case 'dm':
            if (this.channel.type === 'dm') continue;
            throw new Exception(100, 'This command can only be used in DM channels!');

          case 'guild':
            if (this.guild) continue;
            throw new Exception(100, 'This command can only be used in guild channels!');

          case 'nsfw':
            if (this.channel instanceof TextChannel && this.channel.nsfw) continue;
            throw new Exception(100, 'This command can only be used in channels marked nsfw!');

          default:
            throw new Error('Invalid LockType provided!');
        }
      }
    }
  }
}
