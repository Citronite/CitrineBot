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
    get id() {
        return this.data.id;
    }
    get prefix() {
        return this.data.prefix;
    }
    set prefix(str) {
        this.data.prefix = str;
    }
    get disabledRole() {
        return this.data.disabledRole;
    }
    set disabledRole(id) {
        this.data.disabledRole = id;
    }
    get deleteCmdCalls() {
        return this.data.deleteCmdCalls;
    }
    set deleteCmdCalls(val) {
        this.data.deleteCmdCalls = val;
    }
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
    get readMsgEdits() {
        return this.data.readMsgEdits;
    }
    set readMsgEdits(val) {
        this.data.readMsgEdits = val;
    }
    get disabledUsers() {
        return [...this.data.disabledUsers];
    }
    disableUser(id) {
        const tmp = new Set(this.data.disabledUsers);
        tmp.add(id);
        this.data.disabledUsers = [...tmp];
    }
    enableUser(id) {
        const tmp = new Set(this.data.disabledUsers);
        tmp.delete(id);
        this.data.disabledUsers = [...tmp];
    }
    get disabledChannels() {
        return [...this.data.disabledChannels];
    }
    disableChannel(id) {
        const tmp = new Set(this.data.disabledChannels);
        tmp.add(id);
        this.data.disabledChannels = [...tmp];
    }
    enableChannel(id) {
        const tmp = new Set(this.data.disabledChannels);
        tmp.delete(id);
        this.data.disabledChannels = [...tmp];
    }
    get disabledCommands() {
        return [...this.data.disabledCommands];
    }
    disableCommand(id) {
        const tmp = new Set(this.data.disabledCommands);
        tmp.add(id);
        this.data.disabledCommands = [...tmp];
    }
    enableCommand(id) {
        const tmp = new Set(this.data.disabledCommands);
        tmp.delete(id);
        this.data.disabledCommands = [...tmp];
    }
    get reqRoles() {
        return this.data.reqRoles;
    }
    addReqRole(cmd, role) {
        this.data.reqRoles[cmd] = role;
    }
    removeReqRole(cmd) {
        delete this.data.reqRoles[cmd];
    }
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
