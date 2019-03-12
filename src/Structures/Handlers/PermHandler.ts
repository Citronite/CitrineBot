import { Message } from 'discord.js';
import { CommandError, ErrorTypes } from '../CommandStructures/CommandError';
import { IGuildConfig, Command } from 'typings';
import { CitrineClient } from '../CitrineStructures/CitrineClient';

export class PermHandler {
	constructor() {
		throw new Error('This class may not be instantiated!');
	}

	public static checkCustomFilters(cmd: Command, message: Message, client: CitrineClient): Error | void {
		const { config: globalConfig } = client.settings;
		const config: IGuildConfig = client.settings.getGuild(message.guild.id);
		const errors: string[] = [];

		if (message.author.id === globalConfig.owner) return;

		if (globalConfig.disabledUsers.has(message.author.id)) errors.push('Disabled User [Global]');

		if (config.disabledUsers.has(message.author.id)) errors.push('Disabled User [Local]');

		if (config.disabledChannels.has(message.channel.id)) errors.push('Disabled Channel');

		if (globalConfig.disabledCommands.has(cmd.name)) errors.push('Disabled Command [Global]');

		if (config.disabledCommands.has(cmd.name)) errors.push('Disabled Command [Local]');

		if (errors.length) return new CommandError(cmd, ErrorTypes.FAILED_CUSTOM_FILTERS, errors);
	}
}
