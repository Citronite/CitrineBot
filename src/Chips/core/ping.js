const { BaseCommand } = require('../../exports');

class Ping extends BaseCommand {
    constructor() {
        super({
            name: 'ping',
            description: 'Check bot ping!',
            usage: '[p]ping',
            chip: 'core'
        });
    }

    async execute(ctx) {
        await ctx.send(`🏓 **Pong!** ${Math.floor(ctx.client.ping)}ms`);
    }
}

module.exports = new Ping();
