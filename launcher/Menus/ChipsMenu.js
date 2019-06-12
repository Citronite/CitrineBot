const AbstractMenu = require('./AbstractMenu.js');
const fs = require('fs');
const { resolve } = require('path');
const { println, confirm, execute, input, sleep, open } = require('../cli.js');

const baseCmdTemplate = `
const { BaseCommand } = require('../../exports');

class Name extends BaseCommand {
  constructor() {
    super({
      name: 'name',
      description: 'description',
      usage: '[p]name',
      chip: {{chip}}
    });
  }

  async execute(ctx) {
    await ctx.send('Hello World!');
  }
}

module.exports = new Name();

`;

const subCmdTemplate = `
const { SubCommand } = require('../../exports');

class Name extends Subcommand {
  constructor() {
    super({
      name: 'name',
      description: 'description',
      usage: '[p]name'
    });
  }

  async execute(ctx) {
    await ctx.send('Hello World!');
  }
}

module.exports = new Name();

`;

const root = resolve(`${__dirname}/../../`);

// Allows managing chips through the launcher.
class ChipsMenu extends AbstractMenu {
  constructor() {
    super({
      title: 'What would you like to do?',
      choices: [
        'List downloaded Chips',
        'Download Chip from GitHub',
        'Delete Chip',
        'Create new Chip'
      ]
    });
    this.code = 1;
  }

  // List downloaded Chips
  async 1() {
    println('Downloaded Chips:');
    await sleep(200);
    const chips = fs.readdirSync(`${root}/bin/Chips/`);
    println(chips.join('\n'));
  }

  // Download Chip from GitHub
  2() {
    println('This feature is yet to be implemented!');
  }

  // Delete Chip
  3() {
    println('This feature is yet to be implemented!');
  }

  // Create new Chip
  async 4() {
    const chips = fs.readdirSync(`${root}/bin/Chips/`);

    let chipName = (await input(
      'Please enter the name of your new chip:'
    )).toLowerCase();
    if (chips.includes(chipName)) chipName = false;
    if (/\s|\d/.test(chipName)) chipName = false;
    while (!chipName) {
      chipName = (await input('Please enter a valid name:')).toLowerCase();
      if (chips.includes(chipName)) chipName = false;
      if (/\s|\d/.test(chipName)) chipName = false;
    }

    try {
      println(`Creating path: ./data/${chipName}`);
      fs.mkdirSync(`${root}/data/${chipName}`);

      println(`Creating path: ./bin/Chips/${chipName}`);
      fs.mkdirSync(`${root}/bin/Chips/${chipName}`);

      println(`Creating file: ./bin/Chips/${chipName}/_meta.js`);
      const metaContent = JSON.stringify(
        { author: '<YOUR NAME>', description: '<DESCRIPTION>' },
        null,
        '  '
      );
      fs.writeFileSync(`${root}/bin/Chips/${chipName}/_meta.json`, metaContent);

      println(`Creating file: ./bin/Chips/${chipName}/cmd.js`);
      const baseCmdContent = baseCmdTemplate.replace('{{chip}}', chipName);
      fs.writeFileSync(`${root}/bin/Chips/${chipName}/cmd.js`, baseCmdContent);

      println(`Creating file: ./bin/Chips/${chipName}/_subcmd.js`);
      fs.writeFileSync(
        `${root}/bin/Chips/${chipName}/_subcmd.js`,
        subCmdTemplate
      );

      const createBranch = await confirm(
        `Would you also like to create a git branch the ${chipName} chip?`
      );
      if (createBranch) {
        try {
          println('Creating branch...');
          await execute(`git branch ${chipName}`, { cwd: root });
          println('Checking out...');
          await execute(`git checkout ${chipName}`, {
            cwd: root
          });
          println('Successful!');
        } catch (err) {
          println(err);
        }
      }
      open(`${root}/bin/Chips`);
    } catch (err) {
      println(err);
    }
  }
}

module.exports = ChipsMenu;
