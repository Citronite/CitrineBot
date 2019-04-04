const AbstractMenu = require('./AbstractMenu.js');
const { println, execute, rl } = require('../cli.js');
const fs = require('fs');

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
  async 1() {
    println('Recompiling source code...');
    try {
      println('\nPlease wait...');
      const { stdout, stderr } = await execute('tsc', { cwd: process.cwd() });
      if (stderr) println(stderr);
      if (stdout) println(stdout);
      const bin = fs.readdirSync('./bin');
      if (bin && bin.includes('citrine.js')) {
        println('Successfully recompiled code!');
        return true;
      }
      else {
        throw 'Missing file citrine.js';
      }
    }
    catch (err) {
      println('Uh-oh! An unknown error occurred while compiling code!');
      println(err);
      println('Please make sure Citrine is installed properly, and try again.\n' +
              'For further help, you can join the official support server:\n' +
              'Official Support Server: https://discord.gg/rEM9gFN');
      rl.close();
      process.exit(8);
      return;
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
