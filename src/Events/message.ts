import { Message } from 'discord.js';
import { CitrineClient } from '../Structures/CitrineClient';
import { GuildConfig } from '../Utils/GuildConfig';
import { BaseError } from '../Structures/ErrorStructs/BaseError';
import { ErrorCodes } from '../Structures/ErrorStructs/ErrorCodes';

module.exports = {
	name: 'message',
	maxListeners: 1,
	listener: async (client: CitrineClient, message: Message): Promise<void> => {
		const { settings } = client;
		const { cmdHandler } = client;
		let config: GuildConfig | null = null;
		try {
			config = await settings.getGuild(message.guild.id);
			if (!config) config =  await settings.setGuild(message.guild);
			if (!config) throw new BaseError(ErrorCodes.UNKNOWN_ERROR, ['']);

			if (config.deleteCmdCalls) message.delete(config.deleteCmdCallsDelay);

			cmdHandler.processCommand(message, config);

		} catch (err) {
			client.logger.error(err);
		}
	}
};
