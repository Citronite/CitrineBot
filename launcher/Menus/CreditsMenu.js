const AbstractMenu = require('./AbstractMenu.js');
const { sleep, println } = require('../cli.js');

class CreditsMenu extends AbstractMenu {
  constructor() {
    super({
      title: 'What would you like to view?',
      choices: [
        'View Credits',
        'View License',
      ],
    });

    this.code = 4;
  }

  // View Credits
  async 1() {
    await sleep(500);
    println('Show Credits (or just link to github repo)');
  }

  // View License
  async 2() {
    await sleep(500);
    println('Show License (or just link to github repo)');

  }
}

module.exports = CreditsMenu;
