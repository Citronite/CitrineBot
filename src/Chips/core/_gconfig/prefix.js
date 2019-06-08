const { SubCommand } = require('../../../exports');

class Prefix extends SubCommand {
    constructor() {
        super({
            name: 'prefix',
            description: 'View or change Citrine\'s global prefix.',
            usage: '[p]gconfig prefix [new prefix]'
        });
    }
  
    async execute(ctx, prefix) {
        if (prefix) {
            ctx.client.settings.globalPrefix = prefix;
            await ctx.client.settings.save();
            await ctx.success(`Successfully changed the global prefix to ${prefix}`);
            return;
        }
        else {
            await ctx.send(`The current global prefix is \`${ctx.client.settings.globalPrefix}\``);
            return;
        }
    }
}
module.exports = new Prefix();