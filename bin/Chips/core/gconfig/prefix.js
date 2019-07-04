"use strict";
const { SubCommand } = require('../../../exports');
class Prefix extends SubCommand {
    constructor() {
        super({
            name: 'prefix',
            description: 'View or change the global prefix.',
            usage: '[p]gconfig prefix [new prefix]'
        });
    }
    async execute(ctx, prefix) {
        if (prefix) {
            ctx.client.settings.globalPrefix = prefix;
            await ctx.client.settings.save();
            return ctx.success(`Successfully updated the global prefix to \`${prefix}\``);
        }
        else {
            return ctx.send(`The current global prefix is \`${ctx.client.settings.globalPrefix}\``);
        }
    }
}
module.exports = new Prefix();
