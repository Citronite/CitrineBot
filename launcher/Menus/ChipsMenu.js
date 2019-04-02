const AbstractMenu = require('./AbstractMenu.js');
const fs = require('fs');
const { println, confirm, execute, input } = require('../cli.js');

// Allows managing chips through the launcher.
class ChipsMenu extends AbstractMenu {
  constructor() {
    super({
      title: 'What would you like to do?',
      choices: [
        'List downloaded Chips',
        'Download Chip from GitHub',
        'Delete Chip',
        'Create new Chip',
      ],
    });

    this.code = 1;
  }

  // List downloaded Chips
  1() {
    const files = fs.readdirSync('./bin/Chips/');
    for (const file of files) {
      println(file);
    }
  }

  // Download Chip from GitHub
  2() {
    println('To be implemented!');
  }

  // Delete Chip
  3() {
    println('To be implemented!');
  }

  // Create new Chip
  async 4() {
    let chipName = (await input('Please enter the name of your new chip:')).toLowerCase();
    while (!chipName) {
      chipName = (await input('Please enter a valid name:')).toLowerCase();
    }

    try {
      println(`Creating path: ./data/${chipName}`);
      fs.mkdirSync(`./data/${chipName}`);

      println(`Creating path: ./bin/Chips/${chipName}`);
      fs.mkdirSync(`./src/Chips/${chipName}`);

      println(`Creating file: ./bin/Chips/${chipName}/_meta.js`);
      const _meta = 'module.exports = {\n\tauthor: "<YOUR NAME>"\n\tdescription: "<DESCRIPTION OF CHIP>"\n};\n';
      fs.writeFileSync(`./src/Chips/${chipName}/_meta.js`, _meta);

      const createBranch = await confirm(`Would you also like to create a git branch the ${chipName} chip?`);

      if (createBranch) {
        try {
          println('Creating branch...');
          await execute(`git branch ${chipName}`, { cwd: process.cwd() });
          println('Checking out...');
          await execute(`git checkout ${chipName}`, { cwd: process.cwd() });
          println('Successful!');
        }
        catch (err) {
          println(err);
        }
      }
    }
    catch (err) {
      println(err);
    }
  }
}

module.exports = ChipsMenu;
