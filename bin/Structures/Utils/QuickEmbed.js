"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Colors = {
    RED: 0xcb4154,
    GREEN: 0x00ff40,
    CITRINE: 0x9dffbe
};
class QuickEmbed {
    static error(info = 'An unknown error occurred!') {
        return new discord_js_1.RichEmbed()
            .setColor(Colors.RED)
            .setDescription(info)
            .setFooter('⛔')
            .setTimestamp();
    }
    static success(info = 'Success!') {
        return new discord_js_1.RichEmbed()
            .setColor(Colors.GREEN)
            .setDescription(info)
            .setFooter('✅')
            .setTimestamp();
    }
    static basic(user) {
        if (user instanceof discord_js_1.GuildMember) {
            return new discord_js_1.RichEmbed()
                .setTimestamp()
                .setFooter(`Requested by ${user.user.username}`, user.user.avatarURL)
                .setColor(user.displayColor);
        }
        else {
            return new discord_js_1.RichEmbed()
                .setTimestamp()
                .setFooter(`Requested by ${user.username}`, user.avatarURL)
                .setColor(Colors.CITRINE);
        }
    }
    static cmdHelp(ctx, cmd) {
        const help = ctx.client.utils.format.cmdHelp(cmd);
        const embed = this.basic(ctx.message.member || ctx.author);
        embed
            .setTitle(help.name)
            .setDescription(help.description)
            .addField('Chip', help.chip, true)
            .addField('Base Command', help.base, true);
        if (help.usage)
            embed.addField('Usage', help.usage.replace('[p]', ctx.prefix), false);
        if (help.subcommands)
            embed.addField('SubCommands', help.subcommands, false);
        return embed;
    }
}
exports.default = QuickEmbed;
