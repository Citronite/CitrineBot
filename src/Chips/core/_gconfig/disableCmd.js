const { SubCommand } = require('../../../exports');

class DisableCmd extends SubCommand {
    constructor() {
      super({
        name: 'cmd',
        description: 'Globally disable commands. Only base commands may be disabled. Commands from the `core` chip cannot be disabled.',
        usage: '[p]gconfig disable cmd [...commands]'
      });
    }
  
    async execute(ctx, ...cmds) {
        if (cmds.length) {
            const disabled = [];
            for (const cmd of cmds) {
                const [exists,] = ctx.client.cmdHandler.getBaseCmd(ctx.message, [cmd]);
                if (!exists) continue;
                ctx.client.settings.disableCommand(cmd);
                disabled.push(cmd);
            }
            if (disabled.length) {
                const { inline, bold } = ctx.client.utils.format;
                await ctx.client.settings.save();
                ctx.success(`Successfully disabled commands:\n${bold(inline(disabled)).join('\n')}`);
                return;
            }
            else {
                ctx.error('No commands were disabled. Did you provide the correct names?');
                return;
            }
        }
        else {
            const { inline, bold } = ctx.client.utils.format;
            const disabled = ctx.client.settings.disabledCommands;
            if (disabled.length) {
                await ctx.send(`Disabled Commands: ${bold(inline(disabled)).join(', ')}`);
            }
            else {
                await ctx.send('No commands disabled currently.');
            }
            return;
        }
    }
}

module.exports = new DisableCmd();
