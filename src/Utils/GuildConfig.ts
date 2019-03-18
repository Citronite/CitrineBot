import { Guild } from 'discord.js';
import {
	IGuildConfig,
	GuildID,
	ChannelID,
	RoleID,
	UserID
} from 'typings';

const props = [
	'id',
	'prefix',
	'disabledRole',
	'deleteCmdCalls',
	'deleteCmdCallsDelay',
	'readMsgEdits',
	'disabledUsers',
	'disabledChannels',
	'disabledCommands',
	'reqRoles'
];

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

	constructor(guild: Guild | IGuildConfig) {
		if (guild instanceof Guild) {
			// Have to use any here since TS doesn't know guild.client
			// would be CitrineClient instead of Client.
			const client: any = guild.client;

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

		}	else {

			Object.keys(guild).forEach(val => {
				if (!props.includes(val)) throw new Error('Invalid data provided to GuildConfig constructor!');
			});

			this.id = guild.id;
			this.prefix = guild.prefix;
			this.disabledRole = guild.disabledRole;
			this.deleteCmdCalls = guild.deleteCmdCalls;
			this.deleteCmdCallsDelay = guild.deleteCmdCallsDelay;
			this.readMsgEdits = guild.readMsgEdits;
			this.disabledUsers = new Set(guild.disabledUsers);
			this.disabledChannels = new Set(guild.disabledChannels);
			this.disabledCommands = new Set(guild.disabledCommands);
			this.reqRoles = guild.reqRoles;

		}
	}

	public setReqRole(cmd: string, role: RoleID): void {
		this.reqRoles[cmd] = role;
	}

	public unsetReqRole(cmd: string): void {
		this.reqRoles[cmd] = undefined;
	}

	public toJSON(): object {
		return {
			...this,
			disabledUsers: [...this.disabledUsers],
			disabledChannels: [...this.disabledChannels],
			disabledCommands: [...this.disabledCommands],
		};
	}

	public toString(): string {
		const obj = this.toJSON();
		return JSON.stringify(obj, null, '\t');
	}
}
