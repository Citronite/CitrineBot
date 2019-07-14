"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path_1 = require("path");
const util_1 = require("util");
const discord_js_1 = require("discord.js");
const CmdHandler_1 = __importDefault(require("./Handlers/CmdHandler"));
const PermHandler_1 = __importDefault(require("./Handlers/PermHandler"));
const CitrineUtils_1 = __importDefault(require("./Citrine/CitrineUtils"));
const CitrineSettings_1 = __importDefault(require("./Citrine/CitrineSettings"));
const GuildConfig_1 = __importDefault(require("./Utils/GuildConfig"));
const Memory_1 = __importDefault(require("./DbProviders/Memory"));
const Console_1 = __importDefault(require("./Loggers/Console"));
const root = path_1.resolve(`${__dirname}/../../`);
const { readdirSync } = fs;
const readdirAsync = util_1.promisify(fs.readdir);
function fileFilter(arr) {
    return arr.filter(val => !val.startsWith('_') && val.endsWith('.js'));
}
function resolveDbProvider(options) {
    if (!options || !options.DbProvider)
        return Memory_1.default;
    const { DbProvider } = options;
    const drivers = fileFilter(readdirSync(`${root}/bin/Structures/DbProviders`));
    if (drivers.includes(`${DbProvider}.js`)) {
        return require(`${root}/bin/Structures/DbProviders/${DbProvider}.js`).default;
    }
    else {
        throw new Error('Invalid DbProvider option provided!');
    }
}
function resolveLogger(options) {
    if (!options || !options.logger)
        return Console_1.default;
    const { logger } = options;
    const loggers = fileFilter(readdirSync(`${root}/bin/Structures/Loggers`));
    if (loggers.includes(`${logger}.js`)) {
        return require(`${root}/bin/Structures/Loggers/${logger}.js`).default;
    }
    else {
        throw new Error('Invalid logger option provided!');
    }
}
async function initChips(client) {
    const allChips = await readdirAsync(`${root}/bin/Chips`);
    const defaults = client.defaultChips;
    const chips = defaults.has('all') ? allChips : client.defaultChips;
    for (const chip of chips)
        await client.loadChip(chip);
}
async function updateMetaData(client) {
    const data = require(`${root}/data/core/_instance.json`);
    const app = await client.fetchApplication();
    client.settings.owner = app.owner.id;
    data.botOwner = app.owner.id;
    data.appOwner = app.owner.id;
    data.appId = app.id;
    const path = `${root}/data/core/_instance.json`;
    const content = JSON.stringify(data, null, '  ');
    fs.writeFile(path, content, err => {
        if (err)
            client.logger.warn(err);
    });
}
class CitrineClient extends discord_js_1.Client {
    constructor(options) {
        super(options);
        this.settings = new CitrineSettings_1.default(this);
        this.permHandler = new PermHandler_1.default();
        this.cmdHandler = new CmdHandler_1.default();
        this.commands = new discord_js_1.Collection();
        this.utils = new CitrineUtils_1.default();
        const DbProvider = resolveDbProvider(options);
        this.db = new DbProvider();
        const logger = resolveLogger(options);
        this.logger = new logger();
        this.defaultChips = new Set(['core']);
        if (options && options.defaultChips) {
            this.defaultChips = new Set(['core', ...options.defaultChips]);
        }
        this.lastException = null;
    }
    async loadChip(chip) {
        try {
            const dir = await readdirAsync(`${root}/bin/Chips/${chip}`);
            const cmdFiles = fileFilter(dir);
            for (const file of cmdFiles) {
                const cmd = require(`../Chips/${chip}/${file}`);
                this.commands.set(cmd.name, cmd);
            }
            if (dir.includes('_setup.js')) {
                const { load: fn } = require(`../Chips/${chip}/_setup.js`);
                if (typeof fn === 'function')
                    fn(this);
            }
            return Promise.resolve(`Successfully loaded chip: ${chip}`);
        }
        catch (err) {
            return Promise.reject(`Failed to load chip: ${chip}\n${err.stack}`);
        }
    }
    async unloadChip(chip) {
        try {
            const dir = await readdirAsync(`${root}/bin/Chips/${chip}`);
            this.commands.sweep(cmd => cmd.chip === chip);
            if (dir.includes('_setup.js')) {
                const { unload: fn } = require(`../Chips/${chip}/_setup.js`);
                if (typeof fn === 'function')
                    fn(this);
            }
            return Promise.resolve(`Successfully unloaded chip: ${chip}`);
        }
        catch (err) {
            return Promise.reject(`Failed to unload chip: ${chip}\n${err.stack}`);
        }
    }
    async clearChipCache(chip) {
        try {
            const basePath = path_1.resolve(`${root}/bin/Chips/${chip}`);
            const cachedPaths = Object.keys(require.cache);
            for (const path of cachedPaths) {
                if (path.startsWith(basePath))
                    delete require.cache[path];
            }
            return Promise.resolve(`Successfully cleared cache for chip: ${chip}`);
        }
        catch (err) {
            return Promise.reject(`Failed to clear cache for chip: ${chip}\n${err.stack}`);
        }
    }
    async launch() {
        try {
            this.logger.info('----------------');
            this.logger.info('Loading chips...');
            await initChips(this);
            this.logger.info('Fetching data...');
            const data = require(`${root}/data/core/_instance.json`);
            await this.settings.load();
            if (this.settings.globalPrefix === 'DEFAULT') {
                this.settings.globalPrefix = data.initialPrefix;
            }
            this.logger.info('Logging in to Discord...');
            await this.login(data.TOKEN);
            if (this.settings.owner === 'DEFAULT') {
                updateMetaData(this);
            }
            await this.settings.save();
        }
        catch (err) {
            this.logger.error(err);
        }
    }
    async getGuild(id) {
        const db = this.db;
        const guild = await db.guilds.read(id);
        return guild ? new GuildConfig_1.default(guild) : undefined;
    }
    async setGuild(id, data) {
        const guild = new GuildConfig_1.default(data);
        const db = this.db;
        await db.guilds.update(id, guild.toJSON());
    }
    async delGuild(id) {
        const db = this.db;
        await db.guilds.delete(id);
    }
}
exports.default = CitrineClient;
