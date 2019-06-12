import { CitrineClient } from '../Structures/CitrineClient';

module.exports = {
  name: 'disconnect',
  listener: async (client: CitrineClient) => {
    client.logger.error('Connection error, client disconnected!');
    await client.settings.save();
    process.exit(1);
  }
};
