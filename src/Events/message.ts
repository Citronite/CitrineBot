import { Message } from 'discord.js';
import { CitrineClient } from '../CitrineStructures/CitrineClient';
import { GuildConfig } from '../Utils/GuildConfig';

module.exports = {
	name: 'message',
	maxListeners: 5,
	listener: (client: CitrineClient, message: Message): void => {
		const { settings } = client;
		const { CmdHandler } = client.utils;

		const config: GuildConfig = settings.getGuild(message.guild) || settings.setGuild(message.guild);
		if (config.deleteCmdCalls) message.delete(config.deleteCmdCallsDelay);

		CmdHandler.processCmd(message, config); // CmdHandler.processCmd() should ONLY check perms, and then execute cmd. no other side effects.
	}
};
