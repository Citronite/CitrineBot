const { BaseCommand } = require('../../exports');

class Eval extends BaseCommand {
  constructor() {
    super('eval', 'dev-utils', {
      description: 'Execute arbitrary JavaScript code.',
      usage: '[p]eval <code>'
    });
  }

  execute(ctx, ...args) {
    ctx.checkDM();
    try { ctx.checkBotOwner(); }
    catch (_) { ctx.checkBotDev(); }

    const code = args.join(' ');
    ctx.send(`[Code]\n${code}`, { code: 'js', split: true });

		try {
			const result = eval(code);
      ctx.send(`[Result]\n${result}`, { code: 'js', split: true });
		}
		catch (err) {
			ctx.send(`[Error]\n${err}`, { code: 'js', split: true });
		}
  }
}

module.exports = new Eval();
