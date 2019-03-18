import { GuildConfig } from '../../Utils/GuildConfig';
import { CitrineClient } from '../CitrineClient';
import { BaseError } from '../ErrorStructs/BaseError';
import { ErrorCodes } from '../ErrorStructs/ErrorCodes';
import { Command } from '../CommandStructs/AbstractCommand';
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

	public static async checkCustomFilters(cmd: Command, message: Message, client: CitrineClient): Promise<boolean> {
		const { globalConfig } = client.settings;
		try {
			const config: GuildConfig = await client.settings.getGuild(message.guild.id);
			const errors = [];

			if (message.author.id === globalConfig.owner) return Promise.resolve(true);

			if (globalConfig.disabledUsers.has(message.author.id)) errors.push('Disabled User [Global]');

			if (config.disabledUsers.has(message.author.id)) errors.push('Disabled User [Local]');

			if (config.disabledChannels.has(message.channel.id)) errors.push('Disabled Channel');

			if (globalConfig.disabledCommands.has(cmd.name)) errors.push('Disabled Command [Global]');

			if (config.disabledCommands.has(cmd.name)) errors.push('Disabled Command [Local]');

			return errors.length ? Promise.reject(new BaseError(ErrorCodes.FAILED_CUSTOM_FILTERS, errors)) : Promise.resolve(true);
		} catch (err) {
			return Promise.reject(err);
		}
	}

	public static checkDiscordPerms(channel: TextChannel, member: GuildMember, perms: PermissionResolvable, checkAdmin: boolean = true): void | BaseError {
		const memberPerms = channel.memberPermissions(member);
		if (memberPerms === null) throw new BaseError(ErrorCodes.NOT_FOUND, [`Member permissions not found (id: ${member.id})`]);

		const missing = memberPerms.missing(perms, checkAdmin);
		if (!missing) return;

		const missingFlags = new Permissions(missing).toArray(checkAdmin);
		const code = channel.client.user.id === member.id ? ErrorCodes.MISSING_BOT_PERMS : ErrorCodes.MISSING_MEMBER_PERMS;
		throw new BaseError(code, missingFlags);
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
