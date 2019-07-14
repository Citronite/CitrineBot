"use strict";
const { SubCommand } = require('../../../exports');
class Enable extends SubCommand {
    constructor() {
        super({
            name: 'enable',
            description: 'Enable guilds/users/commands globally.',
            usage: '[p]config enable <"cmd" | "user" | "channel">'
        });
    }
}
class EnableCmd extends SubCommand {
    constructor() {
        super({
            name: 'cmd',
            description: 'Locally enable commands.',
            usage: '[p]config enable cmd [...command]'
        });
    }
    async execute(ctx, ...cmds) {
        const { inline } = ctx.client.utils.format;
        const data = await ctx.client.getGuild(ctx.guild.id);
        if (cmds.length) {
            const enabled = [];
            for (const cmd of cmds) {
                const [found] = ctx.client.cmdHandler.getBaseCmd(ctx.message, [cmd]);
                if (!found)
                    continue;
                data.enableCommand(found.name);
                enabled.push(cmd);
            }
            if (enabled.length) {
                await ctx.client.setGuild(ctx.guild.id, data);
                return ctx.success(`Successfully enabled commands: ${inline(enabled).join(', ')}`);
            }
            else {
                return ctx.error('No commands were enabled. Are you sure you provided the correct names?');
            }
        }
        else {
            const { disabledCommands: disabled } = data;
            if (disabled.length) {
                return ctx.send(`Currently disabled commands: ${inline(disabled).join(', ')}`);
            }
            else {
                return ctx.send('No commands disabled currently.');
            }
        }
    }
}
class EnableUser extends SubCommand {
    constructor() {
        super({
            name: 'user',
            description: 'Locally enable users from using this bot. Only works on users the bot can see.',
            usage: '[p]config enable user [...UserID/@User]'
        });
    }
    async execute(ctx, ...users) {
        const { inline } = ctx.client.utils.format;
        const data = ctx.cliet.getGuild(ctx.guild.id);
        if (users.length) {
            const enabled = [];
            for (const user of users) {
                const found = await ctx.client.utils.djs.resolveUser(ctx.client, user);
                if (!found)
                    continue;
                data.enableUser(found.id);
                enabled.push(found.tag);
            }
            if (enabled.length) {
                await ctx.client.setGuild(ctx.guild.id, data);
                return ctx.success(`Successfully enabled users: ${inline(enabled).join(', ')}`);
            }
            else {
                return ctx.error('No users were enabled. Are you sure you provided the correct names?');
            }
        }
        else {
            const { disabledUsers: disabled } = ctx.client.settings;
            if (disabled.length) {
                return ctx.send(`Currently disabled users: ${disabled.map(id => `<@${id}>`).join(', ')}`);
            }
            else {
                return ctx.send(`No users enabled currently.`);
            }
        }
    }
}
class EnableChannel extends SubCommand {
    constructor() {
        super({
            name: 'cmd',
            description: 'Enable channels for the bot. Only works on channels the bot can see.',
            usage: '[p]config enable channel [...#Channel/ChannelID]'
        });
    }
    async execute(ctx, ...channels) {
        const { inline } = ctx.client.utils.format;
        const data = ctx.client.getGuild(ctx.guild.id);
        if (channels.length) {
            const enabled = [];
            for (const channel of channels) {
                const found = await ctx.client.utils.djs.resolveGuildChannel(ctx.guild, channel);
                if (!found)
                    continue;
                data.enableChannel(found.id);
                enabled.push(found.name);
            }
            if (enabled.length) {
                await ctx.client.setGuild(ctx.guild.id, data);
                return ctx.success(`Successfully enabled channels:\n${inline(enabled).join(', ')}`);
            }
            else {
                return ctx.error('No channels were enabled. Are you sure you provided the correct names?');
            }
        }
        else {
            const { disabledChannels: disabled } = ctx.client.settings;
            if (disabled.length) {
                return ctx.send(`Currently disabled channels: ${inline(disabled).join(', ')}`);
            }
            else {
                return ctx.send('No channels disabled currently.');
            }
        }
    }
}
const a = new EnableCmd();
const b = new EnableUser();
const c = new EnableChannel();
module.exports = new Enable().register(a, b, c);
