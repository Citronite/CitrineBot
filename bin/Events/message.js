"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GuildConfig_1 = __importDefault(require("../Structures/Utils/GuildConfig"));
const Exception_1 = __importDefault(require("../Structures/Exceptions/Exception"));
module.exports = {
    name: 'message',
    listener: async (client, message) => {
        const { cmdHandler } = client;
        const db = client.db;
        let config;
        try {
            if (message.guild) {
                config = await db.guilds.read(message.guild.id);
                if (!config) {
                    config = new GuildConfig_1.default(message.guild);
                    await db.guilds.create(message.guild.id, config);
                }
            }
            await cmdHandler.processCommand(message, config);
        }
        catch (err) {
            const error = Exception_1.default.parse(err);
            message.client.emit('exception', error);
        }
    }
};
