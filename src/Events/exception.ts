import { BaseError } from '../Structures/ErrorStructs/BaseError';
import { CitrineClient } from '../Structures/CitrineClient';
import { Message } from 'discord.js';

module.exports = {
  name: 'exception',
  listener: async (client: CitrineClient, msg: Message, error: BaseError) => {
    if (client.settings.verbose) await msg.channel.send(error.toEmbed());
    client.logger.error(error);
    client.lastException = error;
  }
};
