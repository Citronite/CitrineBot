const { BaseCommand, QuickEmbed } = require('../../exports.js');

class Debug extends BaseCommand {
  constructor() {
    super({
      name: 'debug',
      description: 'debug command',
      usage: '[p]debug',
      chip: 'dev'
    });
  }

  async execute(ctx) {
    ctx.lock('botDev');
    let start;

    start = Date.now();
    await ctx.client.db.guilds.read('GLOBAL');
    const dbRead = Date.now() - start;

    start = Date.now();
    await ctx.client.settings.save();
    const dbWrite = Date.now() - start;

    start = Date.now();
    await ctx.send('Beep');
    const msgSend = Date.now() - start;

    const { ping } = ctx.client;
    const { uptime } = ctx.client;

    const memory = process.memoryUsage();
    const usage = [];
    for (let key in memory) {
      usage.push(
        `${key}: ${Math.round((memory[key] / 1024 / 1024) * 100) / 100} MB`
      );
    }

    const embed = QuickEmbed.basic(ctx.author)
      .setTitle('Citrine | Debug')
      .addField("DB Read", `${dbRead} ms`, true)
      .addField('DB Write', `${dbWrite} ms`, true)
      .addField('Message Send', `${msgSend} /  ms`, true)
      .addField('Ping', `${Math.round(ping)} ms`, true)
      .addField('Uptime', `${Math.round(uptime / 1000 / 60)} minutes`, true)
      .addField('Memory Usage', usage.join('\n'), false);

    ctx.send(embed);
  }
}

module.exports = new Debug();
