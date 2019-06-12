const { BaseCommand } = require('../../exports.js');

class Emote extends BaseCommand {
    constructor() {
        super({
            name: 'e',
            description:
                "No nitro? No problem! Just enter the name of the emote and I'll come rescue you!",
            usage: '[p]e <emote>',
            chip: 'utils'
        });
    }

    async execute(ctx, emote) {
        if (emote) {
            const regex = new RegExp(emote, 'gi');
            const found = ctx.client.emojis.find(
                val => regex.test(val.name) || regex.test(val.id)
            );
            if (found) {
                ctx.send(found.toString());
                ctx.message.delete().catch(() => {});
            } else {
                await ctx.send(
                    `😐 Are you sure the emote \`${emote}\` exists?`
                );
                return;
            }
        }
    }
}

module.exports = new Emote();
