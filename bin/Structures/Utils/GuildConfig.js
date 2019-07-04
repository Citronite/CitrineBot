"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class GuildConfig {
    constructor(guild) {
        if (guild instanceof discord_js_1.Guild) {
            const client = guild.client;
            this.data = {
                id: guild.id,
                prefix: client.settings.globalPrefix,
                disabledRole: '',
                deleteCmdCalls: false,
                deleteCmdCallsDelay: 5000,
                readMsgEdits: false,
                disabledUsers: [],
                disabledChannels: [],
                disabledCommands: [],
                reqRoles: {}
            };
        }
        else {
            this.data = {
                id: guild.id,
                prefix: guild.prefix,
                disabledRole: guild.disabledRole,
                deleteCmdCalls: guild.deleteCmdCalls,
                deleteCmdCallsDelay: guild.deleteCmdCallsDelay,
                readMsgEdits: guild.readMsgEdits,
                disabledUsers: [...new Set(guild.disabledUsers)],
                disabledChannels: [...new Set(guild.disabledChannels)],
                disabledCommands: [...new Set(guild.disabledCommands)],
                reqRoles: guild.reqRoles
            };
        }
    }
    /**
     * The ID of the guild
     */
    get id() {
        return this.data.id;
    }
    /**
     * The guild-specific bot prefix.
     */
    get prefix() {
        return this.data.prefix;
    }
    set prefix(str) {
        this.data.prefix = str;
    }
    /**
     * The disabled role for the guild
     */
    get disabledRole() {
        return this.data.disabledRole;
    }
    set disabledRole(id) {
        this.data.disabledRole = id;
    }
    /**
     * Whether to delete command invocations.
     */
    get deleteCmdCalls() {
        return this.data.deleteCmdCalls;
    }
    set deleteCmdCalls(val) {
        this.data.deleteCmdCalls = val;
    }
    /**
     * Delay before deleting command invocations.
     * Must be between 1 to 3600 seconds.
     */
    get deleteCmdCallsDelay() {
        return this.data.deleteCmdCallsDelay;
    }
    set deleteCmdCallsDelay(val) {
        if (val >= 3600000 && val <= 1000) {
            this.data.deleteCmdCallsDelay = val;
        }
        else {
            this.data.deleteCmdCallsDelay = 5000;
        }
    }
    /**
     * Whether to listen for commands on message edits, when possible.
     */
    get readMsgEdits() {
        return this.data.readMsgEdits;
    }
    set readMsgEdits(val) {
        this.data.readMsgEdits = val;
    }
    /**
     * Array of user IDs disabled from using the bot.
     */
    get disabledUsers() {
        return [...this.data.disabledUsers];
    }
    /**
     * Add a user id to the list of disabled users.
     */
    disableUser(id) {
        const tmp = new Set(this.data.disabledUsers);
        tmp.add(id);
        this.data.disabledUsers = [...tmp];
    }
    /**
     * Remove a user id from the list of disabled users.
     */
    enableUser(id) {
        const tmp = new Set(this.data.disabledUsers);
        tmp.delete(id);
        this.data.disabledUsers = [...tmp];
    }
    /**
     * Array of channel IDs the bot will ignore.
     */
    get disabledChannels() {
        return [...this.data.disabledChannels];
    }
    /**
     * Add a channel ID to the list of ignored channels.
     */
    disableChannel(id) {
        const tmp = new Set(this.data.disabledChannels);
        tmp.add(id);
        this.data.disabledChannels = [...tmp];
    }
    /**
     * Remove a channel ID from the list of ignored channels.
     */
    enableChannel(id) {
        const tmp = new Set(this.data.disabledChannels);
        tmp.delete(id);
        this.data.disabledChannels = [...tmp];
    }
    /**
     * Array of disabled BaseCommand names
     */
    get disabledCommands() {
        return [...this.data.disabledCommands];
    }
    /**
     * Add a command to the list of disabled commands
     */
    disableCommand(id) {
        const tmp = new Set(this.data.disabledCommands);
        tmp.add(id);
        this.data.disabledCommands = [...tmp];
    }
    /**
     * Remove a command from the list of disabled commands.
     */
    enableCommand(id) {
        const tmp = new Set(this.data.disabledCommands);
        tmp.delete(id);
        this.data.disabledCommands = [...tmp];
    }
    /**
     * Object containing mapping command names with the ID
     * of the role required to use that command.
     */
    get reqRoles() {
        return this.data.reqRoles;
    }
    /**
     * Add a required role for a command.
     */
    addReqRole(cmd, role) {
        this.data.reqRoles[cmd] = role;
    }
    /**
     * Remove a required role for a command.
     */
    removeReqRole(cmd) {
        delete this.data.reqRoles[cmd];
    }
    /**
     * Convert the data to JSON format.
     */
    toJSON() {
        const conf = this.data;
        return {
            ...conf,
            disabledUsers: [...conf.disabledUsers],
            disabledChannels: [...conf.disabledChannels],
            disabledCommands: [...conf.disabledCommands]
        };
    }
}
exports.default = GuildConfig;
