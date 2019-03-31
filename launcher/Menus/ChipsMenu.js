const AbstractMenu = require('./AbstractMenu.js');
const fs = require('fs');
const { println } = require('../cli.js');

// Allows managing chips through the launcher.
class ChipsMenu extends AbstractMenu {
  constructor() {
    super({
      title: 'What would you like to do?',
      choices: [
        'List installed Chips',
        'Download Chip from GitHub',
        'Delete Chip',
        'Create new Chip',
      ],
    });

    this.code = 1;
  }

  1() {
    const files = fs.readdirSync('./bin/Chips/');
    for (const file of files) {
      println(file);
    }
  }

  2() {
    println('Download Chip from GitHub');
    println('To be implemented!');
  }

  3() {
    println('Delete Chip');
    println('To be implemented!');
  }

  4() {
    println('Create new Chip');
    // This will actually just create boilerplate files in Chips/<Name>
    // including the _meta.js, with defaults in place.
    // Maybe also a git branch for it?
    println('To be implemented!');
  }
}

module.exports = ChipsMenu;
