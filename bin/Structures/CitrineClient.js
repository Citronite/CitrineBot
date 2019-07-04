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
const CmdHandler_1 = __importDefault(require("./Handlers/CmdHandler"));
const PermHandler_1 = __importDefault(require("./Handlers/PermHandler"));
const CitrineUtils_1 = __importDefault(require("./Citrine/CitrineUtils"));
const CitrineSettings_1 = __importDefault(require("./Citrine/CitrineSettings"));
const GuildConfig_1 = __importDefault(require("./Utils/GuildConfig"));
const Memory_1 = __importDefault(require("./DbDrivers/Memory"));
const Console_1 = __importDefault(require("./Loggers/Console"));
const discord_js_1 = require("discord.js");
const root = path_1.resolve(`${__dirname}/../../`);
const { readdirSync } = fs;
const readdirAsync = util_1.promisify(fs.readdir);
function fileFilter(arr) {
    return arr.filter(val => !val.startsWith('_') && val.endsWith('.js'));
}
function resolveDbDriver(options) {
    if (!options || !options.dbDriver)
        return Memory_1.default;
    else {
        const { dbDriver } = options;
        const drivers = fileFilter(readdirSync(`${root}/bin/Structures/DbDrivers`));
        if (drivers.includes(`${dbDriver}.js`)) {
            return require(`${root}/bin/Structures/DbDrivers/${dbDriver}.js`).default;
        }
        else {
            throw new Error('Invalid dbDriver option provided!');
        }
    }
}
function resolveLogger(options) {
    if (!options || !options.logger)
        return Console_1.default;
    else {
        const { logger } = options;
        const loggers = fileFilter(readdirSync(`${root}/bin/Structures/Loggers`));
        if (loggers.includes(`${logger}.js`)) {
            return require(`${root}/bin/Structures/Loggers/${logger}.js`).default;
        }
        else {
            throw new Error('Invalid logger option provided!');
        }
    }
}
class CitrineClient extends discord_js_1.Client {
    constructor(options) {
        super(options);
        this.settings = new CitrineSettings_1.default(this);
        this.commands = new discord_js_1.Collection();
        this.utils = new CitrineUtils_1.default();
        this.cmdHandler = new CmdHandler_1.default();
        this.permHandler = new PermHandler_1.default();
        const dbDriver = resolveDbDriver(options);
        this.db = new dbDriver();
        const logger = resolveLogger(options);
        this.logger = new logger();
        this.defaultChips = ['core'];
        if (options && options.defaultChips) {
            this.defaultChips = ['core', ...options.defaultChips];
        }
        this.lastException = null;
        this.on('error', () => this.logger.error('Connection error. . .'));
        this.on('reconnecting', () => this.logger.warn('Reconnecting. . .'));
        this.on('resume', () => this.logger.info('Connection resumed!'));
    }
    // Loads all chips from the Chips folder.
    // Removes the core chip from cache since it is only loaded once.
    initChips() {
        try {
            const allChips = readdirSync(`${root}/bin/Chips`);
            const chips = this.defaultChips.includes('all') ? allChips : this.defaultChips;
            for (const chip of chips) {
                if (!allChips.includes(chip)) {
                    throw new Error(`Unable to find chip ${chip}. Make sure it is placed in ./bin/Chips`);
                }
                const dir = readdirSync(`${root}/bin/Chips/${chip}`);
                const cmdFiles = fileFilter(dir);
                for (const file of cmdFiles) {
                    const cmd = require(`../Chips/${chip}/${file}`);
                    this.commands.set(cmd.name, cmd);
                    if (chip === 'core') {
                        delete require.cache[require.resolve(`../Chips/core/${file}`)];
                    }
                }
                if (dir.includes('_setup.js')) {
                    const { load: fn } = require(`../Chips/${chip}/_setup.js`);
                    if (typeof fn === 'function')
                        fn(this);
                }
                this.settings.addLoadedChip(chip);
            }
            this.logger.info('Successfully initialized default Chips!');
        }
        catch (err) {
            this.logger.error(`Error initializing default Chips:\n  ${err.stack}`);
            throw 0;
        }
    }
    // Loads event files and then clears cache since
    // events should only be loaded once.
    initEvents() {
        try {
            const eventFiles = fileFilter(readdirSync(`${root}/bin/Events`));
            for (const file of eventFiles) {
                const event = require(`../Events/${file}`);
                if (event.listener)
                    this.on(event.name, event.listener.bind(null, this));
                if (event.once)
                    this.once(event.name, event.once.bind(null, this));
                delete require.cache[require.resolve(`../Events/${file}`)];
            }
            this.logger.info('Successfully initialized event listeners!');
        }
        catch (err) {
            this.logger.error(`Error initializing event listeners:\n  ${err.stack}`);
            throw 0;
        }
    }
    async loadChip(chip) {
        try {
            const allChips = await readdirAsync(`${root}/bin/Chips`);
            if (!allChips.includes(chip)) {
                return Promise.reject(`Unable to find chip: ${chip}!`);
            }
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
            this.logger.info(`Successfully loaded chip: ${chip}`);
            this.settings.addLoadedChip(chip);
            await this.settings.save();
        }
        catch (err) {
            this.logger.warn(`Failed to load chip: ${chip}`);
            this.logger.error(err);
            return Promise.reject(err);
        }
    }
    async unloadChip(chip) {
        try {
            this.commands.sweep(cmd => cmd.chip === chip);
            const dir = await readdirAsync(`${root}/bin/Chips/${chip}`);
            if (dir.includes('_setup.js')) {
                const { unload: fn } = require(`../Chips/${chip}/_setup.js`);
                if (typeof fn === 'function')
                    fn(this);
            }
            this.logger.info(`Successfully unloaded chip: ${chip}`);
            this.settings.removeLoadedChip(chip);
            await this.settings.save();
        }
        catch (err) {
            this.logger.warn(`Failed to unload chip: ${chip}`);
            this.logger.error(err);
            return Promise.reject(err);
        }
    }
    async clearChipCache(chip, all = false) {
        try {
            const dir = await readdirAsync(`${root}/bin/Chips/${chip}`);
            const files = all ? dir : fileFilter(dir);
            for (const file of files) {
                delete require.cache[require.resolve(`../Chips/${chip}/${file}`)];
            }
            this.logger.info(`Successfully cleared cache for chip: ${chip}`);
            return Promise.resolve();
        }
        catch (err) {
            this.logger.warn(`Failed to clear cache for chip: ${chip}`);
            this.logger.error(err);
            return Promise.reject(err);
        }
    }
    // Starts Citrine!
    async launch() {
        try {
            this.initChips();
            this.initEvents();
            this.logger.info('\nFetching data. . .');
            const data = require(`${root}/data/core/_instance.json`);
            await this.settings.load();
            if (this.settings.globalPrefix === 'DEFAULT') {
                this.settings.globalPrefix = data.initialPrefix;
            }
            this.logger.info('\nLogging in to Discord. . .');
            await this.login(data.TOKEN);
            if (this.settings.owner === 'DEFAULT') {
                const app = await this.fetchApplication();
                this.settings.owner = app.owner.id;
                data.botOwner = app.owner.id;
                data.appOwner = app.owner.id;
                data.appId = app.id;
                const path = `${root}/data/core/_instance.json`;
                const content = JSON.stringify(data, null, '  ');
                fs.writeFile(path, content, err => {
                    if (err)
                        this.logger.warn(err);
                });
            }
            await this.settings.save();
        }
        catch (err) {
            this.logger.error(err);
            return Promise.reject(err);
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
