const { BaseCommand, QuickEmbed } = require('../../exports');
const { promisify } = require('util');
const { readdir } = require('fs');
const { resolve } = require('path');

const readdirAsync = promisify(readdir);
const root = resolve(`${__dirname}/../../../`);

class Chip extends BaseCommand {
  constructor() {
    super({
      name: 'chip',
      description: 'Give information on an installed chip, or provide the `--list` flag to view loaded/unloaded chips.',
      usage: '[p]chip <chip | --list>',
      chip: 'core'
    });
  }

  async execute(ctx, chip) {
    if (!chip) throw 'INSUFFICIENT_ARGS';

		const allChips = await readdirAsync(`${root}/bin/Chips`);
		
		if (chip === '--list') {
			const { inline } = ctx.client.utils.format;
			const { loadedChips: loaded } = ctx.client.settings;
			const unloaded = allChips.filter(name => loaded.includes(name));

			const embed = QuickEmbed.basic(ctx.member || ctx.author)
				.addField('Loaded', inline(loaded).join(', '), false)
				.addField('Unloaded', inline(unloaded).join(', '), false);

			return ctx.send(embed);
		}

		if (allChips.includes(chip.toLowerCase())) {
			const meta = require(`${root}/bin/Chips/${chip}/_meta.js`);
			const embed = QuickEmbed.basic(ctx.member || ctx.author).setTitle(chip);

			if (meta.author) embed.setAuthor(meta.author);
			if (meta.description) embed.setDescription(meta.description);
			if (meta.link || meta.url) embed.setURL(meta.link || meta.url);
			if (meta.thumbnail) embed.setThumbnail(meta.thumbnail);
			if (meta.color || meta.colour) embed.setColor(meta.color || meta.colour);

			return ctx.send(embed);
		} else {
			return ctx.error(`Unable to find chip: \`${chip}\``);
		}
  }
}

module.exports = new Chip();
