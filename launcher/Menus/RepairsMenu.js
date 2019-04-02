const AbstractMenu = require('./AbstractMenu.js');
const { println } = require('../cli.js');

class RepairsMenu extends AbstractMenu {
  constructor() {
    super({
      title: 'What would you like to do?',
      choices: [
        'Recompile source code',
        'Reinstall dependencies',
        'Full reinstallation',
      ],
    });

    this.code = 2;
  }

  // Recompile TS code
  1() {
    println('This feature is yet to be implemented!');
  }

  // Reinstall npm dependencies
  2() {
    println('This feature is yet to be implemented!');
  }

  // Factory reset
  3() {
    println('This feature is yet to be implemented!');
  }
}

module.exports = RepairsMenu;
