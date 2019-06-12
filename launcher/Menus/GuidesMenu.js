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
        'Discord.js Official Guide'
      ]
    });
    this.code = 3;
  }

  // Citrine Installation Guides
  1() {
    println('This feature is yet to be implemented!');
  }

  // Citrine Documentation
  2() {
    println('This feature is yet to be implemented!');
  }

  // djs Documentation
  3() {
    println('This feature is yet to be implemented!');
  }

  // Nodejs Documentation
  4() {
    println('This feature is yet to be implemented!');
  }

  // djs Official Guide
  5() {
    println('This feature is yet to be implemented!');
  }
}

module.exports = GuidesMenu;
