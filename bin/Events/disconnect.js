"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: 'disconnect',
    listener: async (client) => {
        client.logger.error('Connection error, client disconnected!');
        await client.settings.save();
        process.exit(1);
    }
};
