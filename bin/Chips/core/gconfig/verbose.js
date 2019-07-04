"use strict";
const { SubCommand } = require('../../../exports');
class Verbose extends SubCommand {
    constructor() {
        super({
            name: 'verbose',
            description: 'View or toggle verbose mode setting.',
            usage: '[p]gconfig verbose ["on" | "off"]'
        });
    }
    async execute(ctx, choice) {
        if (choice) {
            choice = choice.toLowerCase();
            if (!['on', 'off'].includes(choice)) {
                return ctx.error('Please specify `on` or `off`');
            }
            else {
                ctx.settings.verbose = choice === 'on' ? true : false;
                await ctx.client.settings.save();
                return ctx.success(`Verbose mode is now \`${choice.toUpperCase()}\``);
            }
        }
        else {
            return ctx.send(`Verbose mode is currently \`${ctx.client.settings.verbose ? 'ON' : 'OFF'}\``);
        }
    }
}
module.exports = new Verbose();
