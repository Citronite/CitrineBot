import { FormatHelpOptions, CommandHelpObject } from 'typings';
import BaseCommand from '../Command/BaseCommand';
import SubCommand from '../Command/SubCommand';

type Command = BaseCommand | SubCommand;

export default class Formatter {
  public italic(str: string | string[]): string | string[] {
    if (typeof str === 'string') {
      return `*${str}*`;
    } else {
      return str.map(val => `*${val}*`);
    }
  }

  public lined(str: string | string[]): string | string[] {
    if (typeof str === 'string') {
      return `__${str}__`;
    } else {
      return str.map(val => `__${val}__`);
    }
  }

  public striked(str: string | string[]): string | string[] {
    if (typeof str === 'string') {
      return `~~${str}~~`;
    } else {
      return str.map(val => `~~${val}~~`);
    }
  }

  public bold(str: string | string[]): string | string[] {
    if (typeof str === 'string') {
      return `**${str}**`;
    } else {
      return str.map(val => `**${val}**`);
    }
  }

  public inline(str: string | string[]): string | string[] {
    if (typeof str === 'string') {
      return `\`${str}\``;
    } else {
      return str.map(val => `\`${val}\``);
    }
  }

  public block(str: string | string[], lang: string = ''): string | string[] {
    if (typeof str === 'string') {
      return `\`\`\`${lang}\n${str}\`\`\``;
    } else {
      return str.map(val => `\`\`\`${lang}\n${val}\`\`\``);
    }
  }

  public cmdHelp(cmd: Command, options?: FormatHelpOptions): CommandHelpObject {
    let chip;
    let parent;
    let base;
    let usage;
    let subcommands;
    const name = cmd.name;
    const description = cmd.description;
    const maxWidth = options && options.maxWidth ? options.maxWidth : 50;
    const useCodeBlocks =
      options && options.useCodeBlocks ? options.useCodeBlocks : true;

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

      const max = names.reduce(
        (acc, cur) => (acc > cur.length ? acc : cur.length),
        0
      );
      for (let x = 0; x < names.length; x++) {
        const paddedName = names[x].padEnd(max + 2);
        const sliceLength = maxWidth - (max + 2) - 3;
        const slicedDescrip =
          descrips[x].length >= sliceLength
            ? `${descrips[x].slice(0, sliceLength)}...`
            : descrips[x];
        const str = paddedName + slicedDescrip;
        final.push(str);
      }
      subcommands = useCodeBlocks
        ? `\`\`\`\n${final.join('\n')}\n\`\`\``
        : final.join('\n');
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
