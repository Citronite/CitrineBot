const fs = require('fs');
// const path = require('path');
const HomeMenu = require('./Menus/HomeMenu.js');
const {
  cls,
  sleep,
  printHeader,
  println,
  input,
  confirm,
  rl,
  printMenu,
  execute,
} = require('./cli.js');

const Home = new HomeMenu();
// Self-explanatory
async function printHomepage() {
  cls(0, 0);
  printHeader();
  await sleep(500);
  await printMenu(Home);
}

// Compiles code.
async function compileCitrine() {
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
    println('Please make sure Citrine is installed properly, and try again.' +
            'For further help, you can join the official support server:' +
            'Official Support Server: https://discord.gg/rEM9gFN');
    return false;
  }
}

// Adds the line event listener, and prints the homepage
async function startLauncher() {
  rl.on('line', async (line) => {
    line = line.trim();

    if (!line || /\D/g.test(line)) {
      rl.prompt();
      return;
    }

    if (line === '0') {
      // If the current menu is the homepage, then exit the launcher
      if (rl.currMenu.code === 0) {
        rl.close();
        return;
      }
      // Otherwise, go back to the homepage
      else {
        await printHomepage();
      }
    }
    else {
      cls();
      println('');
      // Run whatever option the user chose
      await rl.currMenu.run(line);
    }
  });

  await printHomepage();

}

// MAIN FUNCTION
(async function main() {
  cls(0, 0);
  await sleep();
  printHeader();
  await sleep();

  // Kinda hacky but whatever :P
  // This here sorta checks to make sure everything is in place
  // before trying to start the launcher.
  const dir = fs.readdirSync('.');

  if (dir.includes('data') && dir.includes('bin')) {
    const bin = fs.readdirSync('./bin');
    let data = [];
    try {
      data = fs.readdirSync('./data/core');
    }
    catch(err) {
      println('The core folder is missing from the data directory. Please make sure\nyou installed Citrine correctly and try again.');
      return;
    }

    // Just a very minimal check to see if the initial setup was successful
    if (bin.includes('citrine.js') && data.includes('_settings.json')) {
      await startLauncher();
    }
    else {
      const recompile = await confirm('It seems like you are missing some important files in your bin folder.\nWould you like to try re-compiling Citrine?');

      if (recompile) {
        const finished = await compileCitrine();
        if (!finished) return;
        println('Please restart the launcher. If the problem persists, you\n' +
                'can visit the official support server for more help.' +
                'Official Support Server: https://discord.gg/rEM9gFN');
        return;
      }
      else {
        println('\nAlright then. Please make sure Citrine is installed properly on your device,\nand then try running the launcher again.');
        return;
      }
    }
  }
  else {
    cls(0, 0);
    printHeader();
    await sleep();
    println('Hello there! Seems like this is your first time running Citrine!');
    await sleep(2000);

    // Obtain the bot token
    let TOKEN = await input('Please insert your bot token. If it is stored\non your path, simply enter PATH:<VARIABLE>');
    if (TOKEN.startsWith('PATH:')) TOKEN = process.env[TOKEN.slice(5)];
    while (!TOKEN) {
      TOKEN = await input('Please insert a valid bot token:');
      if (TOKEN.startsWith('PATH:')) TOKEN = process.env[TOKEN.slice(5)];
    }

    // Obtain global prefix
    let prefix = await input('Please choose a global prefix for your bot:');
    while (!prefix) {
      prefix = await input('Please choose a valid prefix for your bot:');
    }

    // Compile source code
    const successful = await compileCitrine();
    if (!successful) return;

    // Run initialSetup functions for the DB and Settings
    try {
      const dbPath = '../bin/Structures/CitrineStructs/CitrineDB.js';
      const settingsPath = '../bin/Structures/CitrineStructs/CitrineSettings.js';
      const { CitrineDB } = require(dbPath);
      const { CitrineSettings } = require(settingsPath);
      await CitrineDB.initialSetup();
      await CitrineSettings.initialSetup(TOKEN, prefix);

      println('Successfully initialized databases and settings for Citrine!');
    }
    catch (err) {
      println('Unknown error occurred while trying to initialize bot settings.');
      println(err);
      println('Please make sure Citrine is installed properly, and try again.');
      return;
    }

    try {
      const start_citrine = ':: Simply run the node script for starting the bot.\nnode run\n';
      fs.writeFile('./start_citrine.bat', start_citrine, (err) => {
        if (err) throw err;
      });

      println('Created file start_citrine.bat\nFrom now on, you can simply click on this file to run the bot!');
    }
    catch (err) {
      println('Error creating start_citrine.bat');
      println(err);
      await sleep();
    }

    // Start the launcher!
    println('\nStarting launcher. . .');
    await sleep();
    await startLauncher();

  }
})();
