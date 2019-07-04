"use strict";
const { SubCommand } = require('../../../exports');
class Disable extends SubCommand {
    constructor() {
        super({
            name: 'disable',
            description: 'Disable guilds/users/commands globally.',
            usage: '[p]gconfig disable <"guild" | "user" | "cmd">'
        });
    }
}
class DisableGuild extends SubCommand {
    constructor() {
        super({
            name: 'guild',
            description: 'Globally disable guilds from using this bot. Only works on guilds the bot can see.',
            usage: '[p]gconfig disable guild [...GuildID/Name]'
        });
    }
    async execute(ctx, ...guilds) {
        const { inline } = ctx.client.utils.format;
        if (guilds.length) {
            const disabled = [];
            for (const guild of guilds) {
                const found = ctx.client.guilds.find(g => g.name === guild || g.id === guild);
                if (!found)
                    continue;
                ctx.client.settings.disableGuild(found.id);
                disabled.push(found.name);
            }
            if (disabled.length) {
                await ctx.client.settings.save();
                return ctx.success(`Successfully disabled guilds: ${inline(disabled).join(', ')}`);
            }
            else {
                return ctx.error('No guilds were disabled. Are you sure you provided the correct names?');
            }
        }
        else {
            const { disabledGuilds: disabled } = ctx.client.settings;
            if (disabled.length) {
                return ctx.send(`Currently disabled guilds: ${inline(disabled).join(', ')}`);
            }
            else {
                return ctx.send('No guilds disabled currently.');
            }
        }
    }
}
class DisableUser extends SubCommand {
    constructor() {
        super({
            name: 'user',
            description: 'Globally disable users from using this bot. Only works on users the bot can see.',
            usage: '[p]gconfig disable user [...UserID/@User]'
        });
    }
    async execute(ctx, ...users) {
        if (users.length) {
            const disabled = [];
            for (const user of users) {
                const found = ctx.client.utils.djs.resolveUser(ctx.client, user);
                if (!found)
                    continue;
                ctx.client.settings.disableUser(found.id);
                disabled.push(found.tag);
            }
            if (disabled.length) {
                const { inline } = ctx.client.utils.format;
                await ctx.client.settings.save();
                return ctx.send(`Successfully disabled users: ${inline(disabled).join(', ')}`);
            }
            else {
                return ctx.error('No users were disabled. Are you sure you provided the correct names?');
            }
        }
        else {
            const { disabledUsers: disabled } = ctx.client.settings;
            if (disabled.length) {
                return ctx.send(`Currently disabled Users: ${disabled.map(id => `<@${id}>`).join(', ')}`);
            }
            else {
                return ctx.send(`No users disabled currently.`);
            }
        }
    }
}
class DisableCmd extends SubCommand {
    constructor() {
        super({
            name: 'cmd',
            description: 'Globally disable commands. Only base commands may be disabled. Commands from the `core` chip cannot be disabled.',
            usage: '[p]gconfig disable cmd [...commands]'
        });
    }
    async execute(ctx, ...cmds) {
        const { inline } = ctx.client.utils.format;
        if (cmds.length) {
            const disabled = [];
            for (const cmd of cmds) {
                const [found] = ctx.client.cmdHandler.getBaseCmd(ctx.message, [cmd]);
                if (!found || found.chip === 'core')
                    continue;
                ctx.client.settings.disableCommand(found.name);
                disabled.push(cmd);
            }
            if (disabled.length) {
                await ctx.client.settings.save();
                return ctx.success(`Successfully disabled commands:\n${inline(disabled).join('\n')}`);
            }
            else {
                return ctx.error('No commands were disabled. Are you sure you provided the correct names?');
            }
        }
        else {
            const { disabledCommands: disabled } = ctx.client.settings;
            if (disabled.length) {
                return ctx.send(`Currently disabled commands: ${inline(disabled).join(', ')}`);
            }
            else {
                return ctx.send('No commands disabled currently.');
            }
        }
    }
}
const a = new DisableGuild();
const b = new DisableUser();
const c = new DisableCmd();
module.exports = new Disable().register(a, b, c);
