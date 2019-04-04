import { BaseError } from '../Structures/ErrorStructs/BaseError';
import { CitrineClient } from '../Structures/CitrineClient';
import { Message } from 'discord.js';

module.exports = {
  name: 'exception',
  listener: (client: CitrineClient, msg: Message, error: BaseError): void => {
    if (client.settings.verbose) {
      msg.channel.send(error.toEmbed());
    }
    if (error.code === 999) client.logger.error(error);
    client.lastException = error;
  }
};
