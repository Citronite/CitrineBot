import { CitrineClient } from '../Structures/CitrineClient';

module.exports = {
  name: 'disconnect',
  listener: (client: CitrineClient) => {
    client.logger.error('Connection error, Client disconnected!');
  },
};
