import { CitrineClient } from '../Structures/CitrineClient';

module.exports = {
    name: 'error',
    listener: (client: CitrineClient) => {
        client.logger.error('Connection error...');
    },
};
