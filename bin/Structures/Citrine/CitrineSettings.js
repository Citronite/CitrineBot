"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CitrineSettings {
    constructor(client) {
        this.client = client;
        this.data = {
            owner: 'DEFAULT',
            globalPrefix: 'DEFAULT',
            verbose: true,
            devs: [],
            disabledUsers: [],
            disabledGuilds: [],
            disabledCommands: [],
            loadedChips: [],
            aliases: {}
        };
    }
    get owner() {
        return this.data.owner;
    }
    set owner(id) {
        this.data.owner = id;
    }
    get globalPrefix() {
        return this.data.globalPrefix;
    }
    set globalPrefix(str) {
        this.data.globalPrefix = str;
    }
    get verbose() {
        return this.data.verbose;
    }
    set verbose(val) {
        this.data.verbose = val;
    }
    get devs() {
        return [...this.data.devs];
    }
    addDev(id) {
        const tmp = new Set(this.data.devs);
        tmp.add(id);
        this.data.devs = [...tmp];
    }
    removeDev(id) {
        const tmp = new Set(this.data.devs);
        tmp.delete(id);
        this.data.devs = [...tmp];
    }
    get disabledUsers() {
        return [...this.data.disabledUsers];
    }
    disableUser(id) {
        if (id === this.owner)
            return;
        if (id === this.client.user.id)
            return;
        const tmp = new Set(this.data.disabledUsers);
        tmp.add(id);
        this.data.disabledUsers = [...tmp];
    }
    enableUser(id) {
        const tmp = new Set(this.data.disabledUsers);
        tmp.delete(id);
        this.data.disabledUsers = [...tmp];
    }
    get disabledGuilds() {
        return [...this.data.disabledGuilds];
    }
    disableGuild(id) {
        const tmp = new Set(this.data.disabledGuilds);
        tmp.add(id);
        this.data.disabledGuilds = [...tmp];
        const guild = this.client.guilds.get(id);
        if (guild)
            guild.leave();
    }
    enableGuild(id) {
        const tmp = new Set(this.data.disabledGuilds);
        tmp.delete(id);
        this.data.disabledGuilds = [...tmp];
    }
    get disabledCommands() {
        return [...this.data.disabledCommands];
    }
    disableCommand(name) {
        const tmp = new Set(this.data.disabledCommands);
        tmp.add(name);
        this.data.disabledCommands = [...tmp];
    }
    enableCommand(name) {
        const tmp = new Set(this.data.disabledCommands);
        tmp.delete(name);
        this.data.disabledCommands = [...tmp];
    }
    get loadedChips() {
        return [...this.data.loadedChips];
    }
    addLoadedChip(name) {
        const tmp = new Set(this.data.loadedChips);
        tmp.add(name);
        this.data.loadedChips = [...tmp];
    }
    removeLoadedChip(name) {
        if (name === 'core')
            return;
        const tmp = new Set(this.data.loadedChips);
        tmp.delete(name);
        this.data.loadedChips = [...tmp];
    }
    get aliases() {
        return this.data.aliases;
    }
    addAlias(cmd, alias) {
        const aliases = this.data.aliases[cmd]
            ? new Set(this.data.aliases[cmd])
            : new Set();
        aliases.add(alias);
        this.data.aliases[cmd] = [...aliases];
    }
    removeAlias(cmd, alias) {
        if (!this.data.aliases[cmd])
            return;
        const aliases = new Set(this.data.aliases[cmd]);
        aliases.delete(alias);
        this.data.aliases[cmd] = [...aliases];
    }
    async save() {
        try {
            const db = this.client.db;
            await db.guilds.update('GLOBAL', this.data);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async load() {
        try {
            const db = this.client.db;
            const jsonData = await db.guilds.read('GLOBAL');
            if (!jsonData)
                return;
            this.data = jsonData;
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /*
    private fromJSON(conf: any): GlobalConfig {
      return {
        owner: conf.owner,
        globalPrefix: conf.globalPrefix,
        verbose: conf.verbose,
        devs: new Set(conf.devs),
        disabledGuilds: new Set(conf.disabledGuilds),
        disabledCommands: new Set(conf.disabledCommands),
        disabledUsers: new Set(conf.disabledUsers),
        loadedChips: new Set(conf.loadedChips),
        aliases: conf.aliases
      };
    }
  */
    toJSON() {
        const conf = this.data;
        return {
            ...conf,
            devs: [...conf.devs],
            disabledUsers: [...conf.disabledUsers],
            disabledGuilds: [...conf.disabledGuilds],
            disabledCommands: [...conf.disabledCommands],
            loadedChips: [...conf.loadedChips]
        };
    }
}
exports.default = CitrineSettings;
