import { Guild } from 'discord.js';
import { CitrineClient } from '../Structures/CitrineClient';
import {
	IGuildConfig,
	GuildID,
	ChannelID,
	RoleID,
	UserID
} from 'typings';

export class GuildConfig implements IGuildConfig {
	public readonly id: GuildID;
	public prefix: string;
	public disabledRole: RoleID;
	public deleteCmdCalls: boolean;
	public deleteCmdCallsDelay: number;
	public readMsgEdits: boolean;
	public disabledUsers: Set<UserID>;
	public disabledChannels: Set<ChannelID>;
	public disabledCommands: Set<string>;
	public reqRoles: { [cmd in string]: RoleID | undefined };

	constructor(guild?: Guild, oldConfig?: IGuildConfig) {
		if (guild) {
			const client: CitrineClient = guild.client;

			this.id = guild.id;
			this.prefix = client.settings.global.prefix;
			this.disabledRole = '';
			this.deleteCmdCalls = false;
			this.deleteCmdCallsDelay = 0;
			this.readMsgEdits = false;
			this.disabledUsers = new Set();
			this.disabledChannels = new Set();
			this.disabledCommands = new Set();
			this.reqRoles = {};

		}	else if (oldConfig) {

			this.id = oldConfig.id;
			this.prefix = oldConfig.prefix;
			this.disabledRole = oldConfig.disabledRole;
			this.deleteCmdCalls = oldConfig.deleteCmdCalls;
			this.deleteCmdCallsDelay = oldConfig.deleteCmdCallsDelay;
			this.readMsgEdits = oldConfig.readMsgEdits;
			this.disabledUsers = new Set(oldConfig.disabledUsers);
			this.disabledChannels = new Set(oldConfig.disabledChannels);
			this.disabledCommands = new Set(oldConfig.disabledCommands);
			this.reqRoles = oldConfig.reqRoles;

		}	else {
			throw new Error('Invalid data provided for GuildConfig!');
		}
	}

	public setReqRole(cmd: string, role: RoleID): void {
		this.reqRoles[cmd] = role;
	}

	public unsetReqRole(cmd: string): void {
		this.reqRoles[cmd] = undefined;
	}

	public toString(): string {
		const tmp = {
			...this,
			disabledUsers: [...this.disabledUsers],
			disabledChannels: [...this.disabledChannels],
			disabledCommands: [...this.disabledCommands],
		};
		return JSON.stringify(tmp, null, '\t');
	}
}
