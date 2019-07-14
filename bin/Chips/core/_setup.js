"use strict";
const { resolve } = require('path');
const { QuickEmbed, GuildConfig, Exception } = require('../../exports');
const dbPath = resolve(`${__dirname}/../../../data/core/guilds.sqlite`);
async function onceReady(client) {
    const name = client.user.tag;
    const servers = client.guilds.size;
    const invite = await client.generateInvite();
    const app = await client.fetchApplication();
    const log = client.logger.info;
    log(`=====${'='.repeat(name.length)}=====`);
    log(`     ${name}   `);
    log(`=====${'='.repeat(name.length)}=====\n`);
    log(`Active in     : ${servers} ${servers === 1 ? 'server' : 'servers'}`);
    log(`Bot Owner     : ${app.owner.tag}`);
    log(`Global Prefix : ${client.settings.globalPrefix}`);
    log(`Invite Link:\n${invite}`);
    log('\n(Note: Closing this window will also shut down the bot!)\n');
}
function ready(client) {
    client.logger.info(`${client.user.tag} is online!\n`);
}
async function disconnect(client) {
    client.logger.error('Connection error, client disconnected!');
    await client.settings.save();
    process.exit(1);
}
async function exception(client, err, ctx, cmd) {
    const ignored = [101, 102, 103, 201, 202];
    if (ctx) {
        if (cmd && err.code === 201) {
            await ctx.send(QuickEmbed.cmdHelp(ctx, cmd));
        }
        else if (client.settings.verbose) {
            await ctx.send(err.toEmbed());
        }
        else {
            await ctx.error('Unknown error occurred!\nCheck console for more details!');
        }
    }
    if (ignored.includes(err.code))
        return;
    client.logger.error(err);
    client.lastException = err;
}
async function message(client, message) {
    const { cmdHandler, db } = client;
    let config;
    try {
        if (message.guild) {
            config = await db.guilds.read(message.guild.id);
            if (!config) {
                config = new GuildConfig(message.guild);
                await db.guilds.create(message.guild.id, config);
            }
        }
        await cmdHandler.processCommand(message, config);
    }
    catch (err) {
        const error = Exception.parse(err);
        client.emit('exception', error);
    }
}
module.exports = {
    load: client => {
        client.db.connect('guilds', dbPath);
        client.once('ready', onceReady.bind(null, client));
        client.on('ready', ready.bind(null, client));
        client.on('disconnect', disconnect.bind(null, client));
        client.on('exception', exception.bind(null, client));
        client.on('message', message.bind(null, client));
        client.on('error', () => client.logger.error('Connection error. . .'));
        client.on('reconnecting', () => client.logger.warn('Reconnecting. . .'));
        client.on('resume', () => client.logger.info('Connection resumed!'));
        try {
            client.clearChipCache('core');
        }
        catch (err) {
            client.logger.warn(err);
        }
    }
};
