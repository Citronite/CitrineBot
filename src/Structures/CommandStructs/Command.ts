import { Collection, Guild } from 'discord.js';
import {
	CommandOptions,
	ChannelID,
	GuildID,
} from 'typings';

type Command = SubCommand | BaseCommand | AbstractCommand;

abstract class AbstractCommand {
	public subcommands?: Collection<string, SubCommand>;
	public readonly name: string;
	public readonly description: string;
	public readonly botPerms: string[];
	public readonly memberPerms: string[];
	public readonly usageArgs: Array<string[]>;

	constructor(name: string, options: CommandOptions) {
		this.name = name;
		this.description = options.description || 'No description provided :(';
		// Remove this thing and use PermHandler instead?
		this.botPerms = options.botPerms ? options.botPerms.concat(['VIEW_CHANNEL']) : ['VIEW_CHANNEL'];
		this.memberPerms = options.memberPerms ? options.memberPerms : [];
		this.usageArgs = options.usageArgs || [];
	}

	public registerSubCommands(...subCmds: SubCommand[]): AbstractCommand {
		this.subcommands = new Collection();
		for (const subCmd of subCmds) {
			if (subCmd instanceof SubCommand) {
				subCmd.setParentCmd(this);
				subCmd.setBaseCmd(this);
				this.subcommands.set(subCmd.name, subCmd);
				continue;
			}
			throw new Error('Only instances of the SubCommand class can be registered!');
		}
		return this;
	}
}

export class BaseCommand extends AbstractCommand {
	public readonly module: string;
	public disabled: boolean;
	public readonly disabledIn: ChannelID[];
	public readonly aliases: string[];

	constructor(name: string, module: string, options: CommandOptions) {
		super(name, options);

		this.module = module;
		this.disabled = false;	// Global disable. Bot Owners only
		this.disabledIn = [];		// Channel-specific disable
		// this.reqRole = {};			// { key: GuildID -> val: RoleID } Guild-specific role IDs required to run commands [MOVE TO GuildConfig]
		this.aliases = [];			// Global command aliases. Bot Owners only
	}

	globalEnable(): void { this.disabled = false; }

	globalDisable(): void { this.disabled = true; }

	disableIn(id: ChannelID | GuildID, guild: Guild): ChannelID[] | void {
		const channels = guild.channels.map(c => c.id);

		if (id === guild.id) {
			this.disabledIn.concat(channels);
			return this.disabledIn;
		}

		if (channels.includes(id) && !this.disabledIn.includes(id)) {
			this.disabledIn.push(id);
			return this.disabledIn;
		}
	}

	enableIn(id: ChannelID | GuildID, guild: Guild): ChannelID[] | void {
		const channels = guild.channels.map(c => c.id);

		if (id === guild.id) {
			for (const channel of channels) {
				if (this.disabledIn.includes(channel)) {
					const index = this.disabledIn.indexOf(channel);
					this.disabledIn.splice(index, 1);
				}
			}
			return this.disabledIn;
		}

		if (channels.includes(id) && this.disabledIn.includes(id)) {
			const index = this.disabledIn.indexOf(id);
			this.disabledIn.splice(index, 1);
			return this.disabledIn;
		}
	}

	setAlias(alias: string): string[] {
		if (!this.aliases.includes(alias)) {
			this.aliases.push(alias);
		}
		return this.aliases;
	}

	unsetAlias(alias: string): string[] {
		if (this.aliases.includes(alias)) {
			const index = this.aliases.indexOf(alias);
			this.aliases.splice(index, 1);
		}
		return this.aliases;
	}
}

export class SubCommand extends AbstractCommand {
	private parent: Command | undefined;
	private base: BaseCommand | undefined;

	constructor(name: string, options: CommandOptions) {
		super(name, options);
	}

	setParentCmd(cmd: Command): void | Error {
		if (this.parent) throw new Error('Parent commands cannot be reset!');
		
		if (cmd instanceof BaseCommand || cmd instanceof SubCommand) {
			this.parent = cmd;
		}
	}

	getParentCmd(): Command | undefined {
		return this.parent;
	}

	setBaseCmd(cmd: Command): void | Error {
		if (this.base) throw new Error('Base commands cannot be reset!');

		if (cmd instanceof BaseCommand) {
			this.base = cmd;
		}
		else if (cmd instanceof SubCommand) {
			this.base = cmd.base;
		}
	}

	getBaseCmd(): BaseCommand | undefined {
		return this.base;
	}
}
