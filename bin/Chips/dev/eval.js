"use strict";
const { BaseCommand } = require('../../exports');
const { TOKEN } = require(`${__dirname}/../../../data/core/_instance.json`);
class Eval extends BaseCommand {
    constructor() {
        super({
            name: 'eval',
            description: 'Evaluate arbitrary JavaScript code. If used anywhere other than DMs, some text may be censored (such as the bot token)',
            usage: '[p]eval <code>',
            chip: 'dev'
        });
    }
    async execute(ctx, ...args) {
        ctx.lock('botOwner');
        const { extractCodeBlock } = ctx.client.utils.djs;
        const { censor } = ctx.client.utils.format;
        const extracted = extractCodeBlock(ctx.message.content);
        const lang = (extracted && extracted.lang) || 'Code';
        const code = (extracted && extracted.code) || args.join(' ');
        try {
            const evaled = '' + eval(code);
            const result = ctx.channel.type === 'dm' ? evaled : censor(evaled, TOKEN);
            return ctx.send(`[${lang}]\n${code}\n\n[Result]\n${result}`, {
                code: 'js',
                split: true
            });
        }
        catch (err) {
            return ctx.send(`[${lang}]\n${code}\n\n[Error]\n${err}`, {
                code: 'js',
                split: true
            });
        }
    }
}
module.exports = new Eval();
