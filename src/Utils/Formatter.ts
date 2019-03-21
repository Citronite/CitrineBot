import { Command } from '../Structures/CommandStructs/AbstractCommand';
import { BaseCommand } from '../Structures/CommandStructs/BaseCommand';

export class Formatter {
	constructor() {
		throw new Error('This class may not be instantiated with new!');
	}

	/**
	 * Takes a string or array of strings and formats them as
	 * inline code.
	 * @param {string | string[]} str
	 * @returns {string | string[]}
	 * @static
	 */
	public static inline(str: string | string[]): string | string[] {
		if (typeof str === 'string') {
			return `\`${str}\``;
		} else {
			return str.map(val => `\`${val}\``);
		}
	}

	/**
	 * Takes a string or array of strings and formats them as
	 * codeblocks.
	 * @param {string | string[]} str
	 * @param {string} lang - Language for syntax highlihgting
	 * @returns {string | string[]}
	 * @static
	 */
	public static codeblock(str: string | string[], lang: string = ''): string | string[] {
		if (typeof str === 'string') {
			return `\`\`\`\n${str}\`\`\``;
		} else {
			return str.map(val => `\`\`\`\n${val}\`\`\``);
		}
	}

	/**
	 * Takes a Command object and returns an object containing properly
	 * formatted information, to be displayed for command help
	 * @param {Command} cmd - The command to format help for
	 * @param {number} maxWidth - Maximum width for each line
	 * @param {boolean} useCodeBlocks - Whether to use codeblocks for usage and subcommands help
	 * @returns {object} Object containing formatted help for all properties of a command
	 * @static
	 */
	public static commandHelp(cmd: Command, maxWidth: number = 80, useCodeBlocks: boolean = true): object {
		const name = cmd.name;
		const description = cmd.description;
		let chip;
		let parent;
		let base;
		let usage;
		let subcommands;

		// TypeScript is so dumb, who told me it was a good idea to use it?!?
		if (cmd instanceof BaseCommand) {
			chip = cmd.chip;
			parent = '--/--';
			base = '--/--';
		} else {
			const parentCmd = cmd.getParent();
			const baseCmd = cmd.getBase();
			chip = baseCmd ? baseCmd.chip : '--/--';
			parent = parentCmd ? parentCmd.name : '--/--';
			base = baseCmd ? baseCmd.name : '--/--';
		}

		if (cmd.usage) {
			usage = useCodeBlocks ? `\`\`\`\n${cmd.usage}\n\`\`\`` : cmd.usage;
		}

		if (cmd.subcommands) {
			const names = [];
			const descrips = [];
			const final = [];

			for (const [key, val] of cmd.subcommands) {
				names.push(key);
				descrips.push(val.description);
			}

			const longest = names.reduce((acc, cur) => acc > cur.length ? acc : cur.length, 0);

			for (let x = 0; x <= names.length; x++) {
				const paddedName = names[x].padEnd(longest + 2);
				const sliceLength = (maxWidth - (longest + 2)) - 3;
				const slicedDescrip = `${descrips[x].slice(0, sliceLength)}...`;
				const str = paddedName + slicedDescrip;
				final.push(str);
			}

			subcommands = useCodeBlocks ? `\`\`\`\n${final.join('\n')}\m\`\`\`` : final.join('\n');
		}

		return {
			name,
			description,
			chip,
			parent,
			base,
			usage,
			subcommands
		};
	}
}
