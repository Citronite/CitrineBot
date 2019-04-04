const { BaseCommand } = require('../../exports');

class Eval extends BaseCommand {
  constructor() {
    super('eval', 'dev-utils', {
      description: 'Evaluate arbitrary JavaScript code.',
      usage: '[p]eval <code>'
    });
  }

  execute(ctx, ...args) {
    // Permission checks!
    try {
      // First check if the author is the bot owner
      ctx.checkBotOwner();
    }
    catch (_) {
      // If not, check if the author is a bot developer
      ctx.checkBotDev();
      // Finally, lock the command to only dm channels!
      ctx.lock(ctx.channel.type === 'dm');
    }

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
