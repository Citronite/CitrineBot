import { Message } from 'discord.js';
import { CitrineClient } from '../Structures/CitrineClient';
import { GuildConfig } from '../Utils/GuildConfig';
import { Exception } from '../Structures/Exceptions/Exception';

module.exports = {
  name: 'message',
  listener: async (client: CitrineClient, message: Message): Promise<void> => {
    const { cmdHandler } = client;
    const db: any = client.db;
    let config: GuildConfig | undefined;
    try {
      if (message.guild) {
        config = await db.guilds.read(message.guild.id);
        if (!config) {
          config = new GuildConfig(message.guild);
          await db.guilds.create(message.guild.id, config);
        }
      }
      await cmdHandler.processCommand(message, config);
    } catch (err) {
      const error = Exception.parse(err);
      message.client.emit('exception', error);
    }
  }
};
