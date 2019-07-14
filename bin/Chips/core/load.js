"use strict";
const { BaseCommand } = require('../../exports');
const { promisify } = require('util');
const { readdir } = require('fs');
const { resolve } = require('path');
const readdirAsync = promisify(readdir);
const root = resolve(`${__dirname}/../../../`);
class Load extends BaseCommand {
    constructor() {
        super({
            name: 'load',
            description: 'Loads a chip. Separate multiple names with spaces, or enter `all` to load all. ',
            usage: '[p]load <...chips | "all">',
            chip: 'core'
        });
    }
    async execute(ctx, ...chips) {
        ctx.lock('botOwner');
        if (!chips.length)
            throw 'INSUFFICIENT_ARGS';
        const loaded = [];
        const { loadedChips } = ctx.client.settings;
        const allChips = await readdirAsync(`${root}/bin/Chips`);
        const filteredChips = chips.includes('all')
            ? allChips
            : chips.filter(name => allChips.includes(name));
        for (const chip of filteredChips) {
            try {
                if (loadedChips.includes(chip))
                    continue;
                await ctx.client.loadChip(chip);
                loaded.push(chip);
            }
            catch (err) {
                ctx.client.logger.error(err);
            }
        }
        const { inline } = ctx.client.utils.format;
        if (loaded.length) {
            return ctx.success(`Successfully loaded chip(s):\n${inline(loaded).join(', ')}`);
        }
        else {
            return ctx.error('No chips were loaded. Are you sure you provided the correct name(s)?');
        }
    }
}
module.exports = new Load();
