import { CitrineClient } from '../Structures/CitrineClient';

module.exports = {
    name: 'resume',
    listener: (client: CitrineClient) => {
        client.logger.error('Connection resumed!');
    }
};
