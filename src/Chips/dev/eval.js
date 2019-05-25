const { BaseCommand } = require('../../exports');

class Eval extends BaseCommand {
  constructor() {
    super({
      name: 'eval',
      description: 'Evaluate arbitrary JavaScript code.',
      usage: '[p]eval <code>'
    }, 'dev');
  }

  async execute(ctx, ...args) {
    ctx.lock('dm');
    try {
      ctx.lock('botDev');
    }
    catch (_) {
      ctx.lock('botOwner');
    }
    try {
      const code = args.join(' ');
      await ctx.send(`[Code]\n${code}`, { code: 'js', split: true });
      const result = eval(code);
      await ctx.send(`[Result]\n${result}`, { code: 'js', split: true });
    }
    catch (err) {
      await ctx.send(`[Error]\n${err}`, { code: 'js', split: true });
    }
  }
}

module.exports = new Eval();
