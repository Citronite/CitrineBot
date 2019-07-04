"use strict";
const { BaseCommand, QuickEmbed } = require('../../exports');
class Help extends BaseCommand {
    constructor() {
        super({
            name: 'help',
            description: 'Help command',
            usage: '[p]help [command]',
            chip: 'core'
        });
    }
    async execute(ctx, ...args) {
        if (args.length) {
            const result = ctx.client.cmdHandler.getFinalCmd(ctx.message, args);
            if (!result) {
                return ctx.error(`Unable to find command: \`${args.join(' ')}\``);
            }
            else {
                const [cmd] = result;
                return ctx.send(QuickEmbed.cmdHelp(ctx, cmd));
            }
        }
        else {
            const embed = QuickEmbed.basic(ctx.member || ctx.author);
            embed.setTitle(ctx.client.user.tag);
            embed.setDescription("Hi! I'm an instance of Citrine!");
            return ctx.send(embed);
        }
    }
}
module.exports = new Help();
