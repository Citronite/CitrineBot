import { CitrineClient } from '../Structures/CitrineClient';
import { OAuth2Application } from 'discord.js';

module.exports = {
  name: 'reconnect',
  listener: (client: CitrineClient) => {
    client.logger.info('Reconnecting...');
  },
};
