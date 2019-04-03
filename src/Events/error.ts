import { CitrineClient } from '../Structures/CitrineClient';
import { OAuth2Application } from 'discord.js';

module.exports = {
  name: 'error',
  listener: (client: CitrineClient) => {
    client.logger.error('Connection error...');
  },
};
