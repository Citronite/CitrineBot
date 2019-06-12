const { BaseCommand } = require('../../exports');

class Eval extends BaseCommand {
    constructor() {
        super({
            name: 'eval',
            description: 'Evaluate arbitrary JavaScript code.',
            usage: '[p]eval <code>',
            chip: 'dev'
        });
    }

    async execute(ctx, ...args) {
        ctx.lock('dm', 'botOwner');

        const code = args.join(' ');
        try {
            const result = eval(code);
            await ctx.send(`[Code]\n${code}\n\n[Result]\n${result}`, { code: 'js', split: true });
        }
        catch (err) {
            await ctx.send(`[Code]\n${code}\n\n[Error]\n${err}`, { code: 'js', split: true });
        }
    }
}

module.exports = new Eval();
