import { CitrineClient } from '../Structures/CitrineClient';

module.exports = {
  name: 'disconnect',
  listener: (client: CitrineClient) => {
    client.logger.error('Connection error, client disconnected!');
    client.settings.save();
  },
};
