import { Role, Guild, User, GuildMember, GuildChannel, Client } from 'discord.js';

export class DjsUtils {
  public parseMention(mention: string): string {
    const rgx = /^<(#|@|@!|@&)\d+>$/;
    if (rgx.test(mention)) {
      mention = mention.slice(2, -1);
      if (/^!|&/.test(mention)) mention = mention.slice(1);
    }
    return mention;
  }

  public parseQuotes(text: string): (string | undefined)[] {
    const matches = text.match(/".*?"/g);
    if (!matches || !matches.length) return text.split(/ +/);
    const tmp = ` ${Date.now()}`;
    return text
      .replace(/".*?"/g, tmp)
      .split(/ +/)
      .map(val => (val === tmp.slice(1) ? matches.shift() : val));
  }

  public async resolveRole(guild: Guild, role: string): Promise<Role | null> {
    const parsedRole = this.parseMention(role);
    const finder = (val: Role) => {
      if (parsedRole.startsWith('"') && parsedRole.endsWith('"')) {
        return val.name === parsedRole.slice(1, -1);
      } else {
        return val.name === parsedRole;
      }
    };
    return guild.roles.get(parsedRole) || guild.roles.find(finder) || null;
  }

  public async resolveGuildChannel(
    guild: Guild,
    channel: string
  ): Promise<GuildChannel | null> {
    const parsedChnl = this.parseMention(channel);
    const finder = (val: GuildChannel) => {
      if (val.name === parsedChnl) return true;
      if (parsedChnl.startsWith('#') && val.name === parsedChnl.slice(1))
        return true;
      return false;
    };
    return (
      guild.channels.get(parsedChnl) || guild.channels.find(finder) || null
    );
  }

  public async resolveUser(
    client: Client,
    user: string
  ): Promise<User | null> {
    const parsedUser = this.parseMention(user);
    try {
      const fetched = await client.fetchUser(parsedUser);
      if (fetched) return fetched;

      const rgx = new RegExp(parsedUser, 'i');
      const finder = (val: User) => {
        return (
          val.username === parsedUser ||
          val.tag === parsedUser ||
          rgx.test(val.username)
        );
      };
      return client.users.find(finder) || null;
    } catch (err) {
      // Don't mind this
      const c: any = client;
      c.logger.warn(`resolveUser() failed for [${user}]`);
      return null;
    }
  }

  public async resolveGuildMember(
    guild: Guild,
    member: string
  ): Promise<GuildMember | null> {
    const parsedMember = this.parseMention(member);

    try {
      const fetched = await guild.fetchMember(parsedMember);
      if (fetched) return fetched;

      const fetchedGuild = await guild.fetchMembers(parsedMember, 5);
      const rgx = new RegExp(parsedMember, 'i');
      const finder = (val: GuildMember) => {
        return (
          val.user.id === parsedMember ||
          val.user.username === parsedMember ||
          val.nickname === parsedMember ||
          val.user.tag === parsedMember ||
          rgx.test(val.user.username) ||
          rgx.test(val.nickname)
        );
      };

      return fetchedGuild.members.find(finder) || null;
    } catch (err) {
      const client: any = guild.client;
      client.logger.warn(`resolveGuildMember() failed for [${member}]`);
      return null;
    }
  }
}
