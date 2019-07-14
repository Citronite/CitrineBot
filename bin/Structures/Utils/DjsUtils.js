"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DjsUtils {
    extractCodeBlock(text) {
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
    parseMention(mention) {
        const rgx = /^<(#|@)\d+>$/;
        if (rgx.test(mention)) {
            mention = mention.slice(2, -1);
            if (/^!|&/.test(mention))
                mention = mention.slice(1);
        }
        return mention;
    }
    parseQuotes(text) {
        const matches = text.match(/".*?"/g);
        if (!matches)
            return text.split(/ +/);
        const tmp = Date.now().toString();
        return text
            .replace(/".*?"/g, tmp)
            .split(/ +/)
            .map(val => (val === tmp ? matches.shift() : val));
    }
    async resolveRole(guild, role) {
        role = this.parseMention(role);
        const finder = (val) => {
            if (role.startsWith('"') && role.endsWith('"')) {
                return val.name === role.slice(1, -1);
            }
            else {
                return val.name === role;
            }
        };
        return guild.roles.get(role) || guild.roles.find(finder) || null;
    }
    async resolveGuildChannel(guild, channel) {
        channel = this.parseMention(channel);
        const finder = (val) => {
            if (val.name === channel)
                return true;
            else if (channel.startsWith('#') && val.name === channel.slice(1))
                return true;
            else
                return false;
        };
        return guild.channels.get(channel) || guild.channels.find(finder) || null;
    }
    async resolveUser(client, user) {
        user = this.parseMention(user);
        try {
            const fetched = await client.fetchUser(user);
            if (fetched)
                return fetched;
            const rgx = new RegExp(user, 'i');
            const finder = (val) => {
                return val.username === user || val.tag === user || rgx.test(val.username);
            };
            return client.users.find(finder) || null;
        }
        catch (err) {
            const c = client;
            c.logger.warn(`resolveUser() failed for [${user}]`);
            return null;
        }
    }
    async resolveGuildMember(guild, member) {
        member = this.parseMention(member);
        try {
            const fetched = await guild.fetchMember(member);
            if (fetched)
                return fetched;
            guild = await guild.fetchMembers(member, 5);
            const rgx = new RegExp(member, 'i');
            const finder = (val) => {
                return (val.user.id === member ||
                    val.user.username === member ||
                    val.nickname === member ||
                    val.user.tag === member ||
                    rgx.test(val.user.username) ||
                    rgx.test(val.nickname));
            };
            return guild.members.find(finder) || null;
        }
        catch (err) {
            const c = guild.client;
            c.logger.warn(`resolveGuildMember() failed for [${member}]`);
            return null;
        }
    }
}
exports.default = DjsUtils;
