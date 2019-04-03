import { Message } from 'discord.js';
import { CitrineClient } from '../Structures/CitrineClient';
import { GuildConfig } from '../Utils/GuildConfig';
import { BaseError } from '../Structures/ErrorStructs/BaseError';
import { ErrorMessages } from '../Structures/ErrorStructs/ErrorMessages';

module.exports = {
  name: 'message',
  listener: async (client: CitrineClient, message: Message): Promise<void> => {
    const { cmdHandler, db } = client;
    let config: GuildConfig | null = null;

    try {
      config = await db.getGuild(message.guild.id);
      if (!config) config =  await db.setGuild(message.guild);
      if (!config) throw new BaseError(999, ErrorMessages[999]);

      await cmdHandler.processCommand(message, config);

    } catch (err) {
      client.logger.error(err.stack);
    }
  }
};
