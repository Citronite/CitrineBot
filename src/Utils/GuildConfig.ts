import { IGuildConfig, GuildID, ChannelID, RoleID } from 'typings';
import { Guild } from 'discord.js';

export class GuildConfig implements IGuildConfig {
	public readonly id: GuildID;
	public prefix: string;
	public readonly disabledChannels: ChannelID[];
	public disabledRole: RoleID;
	public deleteCmdCalls: boolean;
	public deleteCmdCallsDelay: number;
	public readonly reqRoles: { [cmd in string]: RoleID }

	constructor(guild: Guild, prefix: string) {
		this.id = guild.id;
		this.prefix = prefix;
		this.disabledChannels = [];
		this.disabledRole = '';
		this.deleteCmdCalls = false;
		this.deleteCmdCallsDelay = 0;
		this.reqRoles = {};
	}

	setDisabledChannel(id: ChannelID): void {
		if (!this.disabledChannels.includes(id)) {
			this.disabledChannels.push(id);
		}
	}
	
	unsetDisabledChannel(id: ChannelID): void {
		if (this.disabledChannels.includes(id)) {
			const index = this.disabledChannels.indexOf(id);
			this.disabledChannels.splice(index, 1);
		}
	}

	setReqRole(cmd: string, role: RoleID): void {
		this.reqRoles[cmd] = role;
	}

	unsetReqRole(cmd: string): void {
		delete this.reqRoles[cmd];
	}

	toString() {
		return JSON.stringify(this, null, '\t');
	}
}
