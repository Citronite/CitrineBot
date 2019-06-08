import { CitrineClient } from '../Structures/CitrineClient';

module.exports = {
    name: 'reconnecting',
    listener: (client: CitrineClient) => {
        client.logger.info('Reconnecting...');
    },
};
