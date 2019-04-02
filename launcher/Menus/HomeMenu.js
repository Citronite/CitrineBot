const AbstractMenu = require('./AbstractMenu.js');
const ChipsMenu = require('./ChipsMenu.js');
const RepairsMenu = require('./RepairsMenu.js');
const GuidesMenu = require('./GuidesMenu.js');
const CreditsMenu = require('./CreditsMenu.js');
const {
  println,
  printMenu,
  sleep,
  execute,
} = require('../cli.js');

const Chips = new ChipsMenu();
const Repairs = new RepairsMenu();
const Guides = new GuidesMenu();
const Credits = new CreditsMenu();

class HomeMenu extends AbstractMenu {
  constructor() {
    super({
      title: 'Welcome to the Citrine Launcher! What would you like to do?',
      choices: [
        'Launch Citrine',
        'Manage Chips',
        'Repairs / Maintenance',
        'View Guides / Documentations',
        'View Credits / License',
      ],
    });
    this.code = 0;
  }

  async 1() {
    await sleep(500);
    println('Launching Citrine. . .');

    await execute('node ./bin/citrine.js', { cwd: process.cwd() });
  }

  2() {
    printMenu(Chips);
  }

  3() {
    printMenu(Repairs);
  }

  4() {
    printMenu(Guides);
  }

  5() {
    printMenu(Credits);
  }
}

module.exports = HomeMenu;
