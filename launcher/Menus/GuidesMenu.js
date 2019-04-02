const AbstractMenu = require('./AbstractMenu.js');
const { println } = require('../cli.js');

class GuidesMenu extends AbstractMenu {
  constructor() {
    super({
      title: 'What would you like to view?',
      choices: [
        'Citrine Installation Guides',
        'Citrine Documentation',
        'Discord.js Documentation',
        'Node.js Documentation',
        'Discord.js Official Guide',
      ],
    });
    this.code = 3;
  }

  // Citrine Installation Guides
  1() {
    println('Unimplemented');

  }

  // Citrine Documentation
  2() {
    println('Unimplemented');
  }

  // djs Documentation
  3() {
    println('Unimplemented');
  }

  // Nodejs Documentation
  4() {
    println('Unimplemented');
  }

  // djs Official Guide
  5() {
    println('Unimplemented');
  }
}

module.exports = GuidesMenu;
