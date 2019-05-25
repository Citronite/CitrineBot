import { Message } from 'discord.js';
import { CitrineClient } from '../Structures/CitrineClient';
import { GuildConfig } from '../Utils/GuildConfig';

module.exports = {
  name: 'message',
  listener: async (client: CitrineClient, message: Message): Promise<void> => {
    const { cmdHandler, db } = client;
    let config: GuildConfig | null = null;

    try {
      if (message.guild) {
        config = await db.getGuild(message.guild.id);
        if (!config) config = await db.setGuild(message.guild);
      }
      await cmdHandler.processCommand(message, config);
    } catch (err) {
      client.logger.error(err.stack);
    }
  }
};
