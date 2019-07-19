import { Exception } from '../../exports.js';
import { Message } from 'discord.js';
import CitrineClient from '../../Structures/CitrineClient.js';

async function listener(oldMsg: Message, newMsg: Message) {
  if (oldMsg.content === newMsg.content) return;
  const { client }: any = newMsg;
  try {
    let config = client.getGuild(newMsg.guild.id);
    if (config && !config.readMsgEdits) return;
    else await client.cmdHandler.processCommand(newMsg, config);
  } catch (err) {
    const error = Exception.parse(err);
    client.emit('exception', error);
  }
}

module.exports = {
  load: (client: CitrineClient) => {
    client.on('messageUpdate', listener);
  },
  unload: (client: CitrineClient) => {
    client.off('messageUpdate', listener);
  }
};
