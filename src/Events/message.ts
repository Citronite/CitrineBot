import { Message } from 'discord.js';
import { CitrineClient } from '../Structures/CitrineClient';
import { GuildConfig } from '../Utils/GuildConfig';
import { Exception } from '../Structures/Exceptions/Exception';

module.exports = {
  name: 'message',
  listener: async (client: CitrineClient, message: Message): Promise<void> => {
    const { cmdHandler, db } = client;
    let config: GuildConfig | null = null;
    try {
      if (message.guild) {
        config = await db.guilds.read(message.guild.id);
        if (!config) {
          config = new GuildConfig(message.guild);
          await db.guilds.create(message.guild.id, config.toJSON());
        }
      }
      await cmdHandler.processCommand(message, config);
    } catch (err) {
      const error = Exception.parse(err);
      message.client.emit('exception', error);
    }
  }
};
