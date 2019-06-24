const AbstractMenu = require('./AbstractMenu.js');
const { println, execute, rl } = require('../cli.js');
const { resolve } = require('path');

const root = resolve(`${__dirname}/../../`);

class RepairsMenu extends AbstractMenu {
  constructor() {
    super({
      title: 'What would you like to do?',
      choices: ['Recompile source code', 'Reinstall dependencies', 'Full reinstallation']
    });

    this.code = 2;
  }

  // Recompile TS src code
  async 1() {
    println('Recompiling source code...');
    try {
      println('\nPlease wait...');
      const { stdout, stderr } = await execute('npm run build', {
        cwd: root
      });

      if (stderr) println(stderr);
      if (stdout) println(stdout);

      println('Successfully recompiled code!');
    } catch (err) {
      println('Uh-oh! An unknown error occurred while compiling code!');
      println(err);
      println(
        'Please make sure Citrine is installed properly, and try again.\n' +
        'For further help, you can join the support server:\n' +
        'Support Server: https://discord.gg/yyqjd3B'
      );
      rl.close();
      process.exit(1);
    }
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
