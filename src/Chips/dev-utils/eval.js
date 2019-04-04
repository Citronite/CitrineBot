const { BaseCommand } = require('../../exports');

class Eval extends BaseCommand {
  constructor() {
    super({
      name: 'eval',
      description: 'Evaluate arbitrary JavaScript code.',
      usage: '[p]eval <code>'
    }, 'dev-utils');
  }

  async execute(ctx, ...args) {
    // First, lock the command to only dm channels!
    ctx.lock(ctx.channel.type === 'dm', { errMessage: 'This command can only be used in DMs!'});
    try {
      // Then check if the author is the bot owner
      ctx.checkBotOwner();
    }
    catch (_) {
      // If not, check if the author is a bot developer
      ctx.checkBotDev();
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
