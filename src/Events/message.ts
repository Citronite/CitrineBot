import { Message } from 'discord.js';
import { CitrineClient } from '../Structures/CitrineClient';

export function listener(client: CitrineClient, message: Message): void {
	const { settings } = client;
	const { CmdHandler } = client.utils;

	const config = settings.getGuild(message.guild) || settings.setGuild(message.guild);
	if (config.deleteCmdCalls) message.delete();

	CmdHandler.processCmd(message, config); // CmdHandler.processCmd() should ONLY check perms, and then execute cmd. no other side effects.
}
