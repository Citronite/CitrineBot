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
    const saveSettings = Date.now() - start;

    start = Date.now();
    const msg = await ctx.send('Beep');
    const msgSend = Date.now() - start;

    start = Date.now();
    await msg.edit('Boop');
    const msgEdit = Date.now() - start;

    start = Date.now();
    await msg.delete();
    const msgDelete = Date.now() - start;

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
      .addField("db.guilds.read()", `${dbRead} ms`, true)
      .addField('settings.save()', `${saveSettings} ms`, true)
      .addField('Message Send', `${msgSend} ms`, true)
      .addField('Message Edit', `${msgEdit} ms`, true)
      .addField('Message Delete', `${msgDelete} ms`, true)
      .addField('Ping', `${Math.round(ping)} ms`, true)
      .addField('Uptime', `${Math.round(uptime / 1000 / 60)} minutes`, true)
      .addField('Memory Usage', usage.join('\n'), false);

    ctx.send(embed);
  }
}

module.exports = new Debug();
