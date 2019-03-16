import { IGuildConfig, Command } from 'typings';
import { CitrineClient } from '../CitrineClient';
import { CommandError } from '../ErrorStructs/CommandError';
import { CommonError } from '../ErrorStructs/CommonError';
import { ErrorCodes } from '../ErrorStructs/ErrorCodes';

import {
	Message,
	GuildMember,
	TextChannel,
	PermissionResolvable,
	Permissions,
	Guild,
	User
} from 'discord.js';

export class PermHandler {
	constructor() {
		throw new Error('This class may not be instantiated with new!');
	}

	public static checkCustomFilters(cmd: Command, message: Message, client: CitrineClient): void | CommandError {
		const { globalConfig } = client.settings;
		const config: IGuildConfig | null = client.settings.getGuild(message.guild.id);
		if (!config) throw new CommonError(ErrorCodes.NOT_FOUND, [`GuildConfig not found (id: ${message.guild.id})`]);

		const errors = [];

		if (message.author.id === globalConfig.owner) return;

		if (globalConfig.disabledUsers.has(message.author.id)) errors.push('Disabled User [Global]');

		if (config.disabledUsers.has(message.author.id)) errors.push('Disabled User [Local]');

		if (config.disabledChannels.has(message.channel.id)) errors.push('Disabled Channel');

		if (globalConfig.disabledCommands.has(cmd.name)) errors.push('Disabled Command [Global]');

		if (config.disabledCommands.has(cmd.name)) errors.push('Disabled Command [Local]');

		if (errors.length) throw new CommandError(cmd, ErrorCodes.FAILED_CUSTOM_FILTERS, errors);
	}

	public static checkDiscordPerms(channel: TextChannel, member: GuildMember, perms: PermissionResolvable, checkAdmin: boolean = true): void | Error {
		const memberPerms = channel.memberPermissions(member);
		if (memberPerms === null) throw new CommonError(ErrorCodes.NOT_FOUND, [`Member permissions not found (id: ${member.id})`]);

		const missing = memberPerms.missing(perms, checkAdmin);
		if (!missing) return;

		const missingFlags = new Permissions(missing).toArray(checkAdmin);
		const code = channel.client.user.id === member.id ? ErrorCodes.MISSING_BOT_PERMS : ErrorCodes.MISSING_MEMBER_PERMS;
		throw new CommonError(code, missingFlags);
	}

	public static checkManageMessages(channel: TextChannel, member: GuildMember, checkAdmin: boolean = true): void {
		return;
	}

	public static checkBan(channel: TextChannel, member: GuildMember, checkAdmin: boolean = true): void {
		return;
	}

	public static checkKick(channel: TextChannel, member: GuildMember, checkAdmin: boolean = true): void {
		return;
	}

	public static checkGuildOwner(guild: Guild, member: GuildMember): void {
		return;
	}

	public static checkBotOwner(user: User | GuildMember): void {
		return;
	}

	public static checkBotDev(): void {
		return;
	}

}
