"use strict";
const { BaseCommand } = require('../../exports');
class Shutdown extends BaseCommand {
    constructor() {
        super({
            name: 'shutdown',
            description: 'Shuts down the bot, with a zero exit code.',
            usage: '[p]shutdown',
            chip: 'core'
        });
    }
    async execute(ctx) {
        ctx.lock('botOwner');
        await ctx.send('Goodbye 👋');
        await ctx.client.settings.save();
        process.exit(0);
    }
}
module.exports = new Shutdown();
