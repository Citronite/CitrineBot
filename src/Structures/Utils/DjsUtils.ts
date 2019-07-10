import { Role, Guild, User, GuildMember, GuildChannel, Client } from 'discord.js';
import { CodeBlockData } from 'typings';

export default class DjsUtils {
  /**
   * Extracts language (if any) and text from a codeblock.
   */
  public extractCodeBlock(text: string): void | CodeBlockData {
    const rgx = /```(.*?)\n(.*)\n```/s;
    const result = rgx.exec(text);

    if (result) {
      return {
        match: result[0],
        lang: result[1],
        code: result[2],
        input: text
      };
    }
  }

  /**
   * Parses mentions to obtain the snowflake.
   */
  public parseMention(mention: string): string {
    const rgx = /^<(#|@)\d+>$/;
    if (rgx.test(mention)) {
      mention = mention.slice(2, -1);
      if (/^!|&/.test(mention)) mention = mention.slice(1);
    }
    return mention;
  }

  /**
   * Parses double-quoted arguments from strings.
   */
  public parseQuotes(text: string): (string | undefined)[] {
    const matches = text.match(/".*?"/g);
    if (!matches) return text.split(/ +/);

    const tmp = Date.now().toString();
    return text
      .replace(/".*?"/g, tmp)
      .split(/ +/)
      .map(val => (val === tmp ? matches.shift() : val));
  }

  /**
   * Resolves a role object given a guild and the string input.
   */
  public async resolveRole(guild: Guild, role: string): Promise<Role | null> {
    role = this.parseMention(role);

    const finder = (val: Role) => {
      if (role.startsWith('"') && role.endsWith('"')) {
        return val.name === role.slice(1, -1);
      } else {
        return val.name === role;
      }
    };
    return guild.roles.get(role) || guild.roles.find(finder) || null;
  }

  /**
   * Resolves a guild channel object given a guild and the string input
   */
  public async resolveGuildChannel(guild: Guild, channel: string): Promise<GuildChannel | null> {
    channel = this.parseMention(channel);

    const finder = (val: GuildChannel) => {
      if (val.name === channel) return true;
      else if (channel.startsWith('#') && val.name === channel.slice(1)) return true;
      else return false;
    };
    return guild.channels.get(channel) || guild.channels.find(finder) || null;
  }

  /**
   * Resolves a user object given the client and the string input.
   */
  public async resolveUser(client: Client, user: string): Promise<User | null> {
    user = this.parseMention(user);

    try {
      const fetched = await client.fetchUser(user);
      if (fetched) return fetched;

      const rgx = new RegExp(user, 'i');
      const finder = (val: User) => {
        return val.username === user || val.tag === user || rgx.test(val.username);
      };
      return client.users.find(finder) || null;
    } catch (err) {
      // Don't mind this :^)
      const c: any = client;
      c.logger.warn(`resolveUser() failed for [${user}]`);
      return null;
    }
  }

  /**
   * Resolves a guild member object given the guild and the string input.
   */
  public async resolveGuildMember(guild: Guild, member: string): Promise<GuildMember | null> {
    member = this.parseMention(member);

    try {
      const fetched = await guild.fetchMember(member);
      if (fetched) return fetched;

      guild = await guild.fetchMembers(member, 5);
      const rgx = new RegExp(member, 'i');
      const finder = (val: GuildMember) => {
        return (
          val.user.id === member ||
          val.user.username === member ||
          val.nickname === member ||
          val.user.tag === member ||
          rgx.test(val.user.username) ||
          rgx.test(val.nickname)
        );
      };
      return guild.members.find(finder) || null;
    } catch (err) {
      const c: any = guild.client;
      c.logger.warn(`resolveGuildMember() failed for [${member}]`);
      return null;
    }
  }
}
