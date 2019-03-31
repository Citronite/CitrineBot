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
        'Node.js Official Guide',
        'JavaScript Guide',
        'TypeScript Guide',
      ],
    });
    this.code = 3;
  }

  1() {
    println('Citrine Installation Guides');
    println('To be implemented!');
  }

  2() {
    println('Citrine Documentation');
    println('To be implemented!');
  }

  3() {
    println('Discord.js Documentation');
    println('To be implemented!');
  }

  4() {
    println('Node.js Documentation');
    println('To be implemented!');
  }

  5() {
    println('Discord.js Official Guide');
    println('To be implemented!');
  }

  6() {
    println('Node.js Official Guide');
    println('To be implemented!');
  }

  7() {
    println('JavaScript Guide');
    println('To be implemented!');
  }

  8() {
    println('TypeScript Guide');
    println('To be implemented!');
  }
}

module.exports = GuidesMenu;
