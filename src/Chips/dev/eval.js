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

  async execute(ctx) {
    ctx.lock('botOwner');
    const { extractCodeBlock } = ctx.client.utils.djs;
    const { censor } = ctx.client.utils.format;

    const extracted = extractCodeBlock(ctx.message.content);
    if (!extracted) return ctx.error('Failed to parse codeblock!');

    const lang = extracted.lang ? extracted.lang : 'Code';
    const { code } = extracted;
    try {
      const result = censor(eval(code).toString(), TOKEN);
      return ctx.send(`[${lang}]\n${code}\n\n[Result]\n${result}`, {
        code: 'js',
        split: true
      });
    } catch (err) {
      return ctx.send(`[${lang}]\n${code}\n\n[Error]\n${err}`, {
        code: 'js',
        split: true
      });
    }
  }
}

module.exports = new Eval();
