const { Exception, GuildConfig } = require('../../exports.js');

async function listener(oldMsg, newMsg) {
  if (oldMsg.content === newMsg.content) return;
  const { client } = newMsg;
  try {
    let config;
    if (newMsg.guild) {
      const { db } = client;
      const { guild } = newMsg;
      config = await db.guilds.read(guild.id);
      if (!config) {
        config = new GuildConfig(guild);
        await db.guilds.create(guild.id, config);
      }
    }
    if (config && !config.readMsgEdits) return;
    await client.cmdHandler.processCommand(newMsg, config);
  } catch (err) {
    const error = Exception.parse(err);
    client.emit('exception', error);
  }
}

module.exports = {
  load: client => {
    client.on('messageUpdate', listener);
  },
  unload: client => {
    client.off('messageUpdate', listener);
  }
};
