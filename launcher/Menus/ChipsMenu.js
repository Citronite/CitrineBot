const AbstractMenu = require('./AbstractMenu.js');
const fs = require('fs');
const { println } = require('../cli.js');

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
    println('To be implemented!');
  }
}

module.exports = ChipsMenu;
