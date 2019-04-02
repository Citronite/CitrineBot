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
    println('Unimplemented');
  }

  // Reinstall npm dependencies
  2() {
    println('Unimplemented');
  }

  // Factory reset
  3() {
    println('Unimplemented');
  }
}

module.exports = RepairsMenu;
