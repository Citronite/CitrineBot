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
  await sleep(200);
  await printMenu(Home);

  println('\n0. Exit Launcher');
  rl.prompt();
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
    println('Please make sure Citrine is installed properly, and try again.\n' +
            'For further help, you can join the official support server:\n' +
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
        process.exit(0);
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
      const code = rl.currMenu.code;

      // Run whatever option the user chose
      try {
        await rl.currMenu.run(line);
      }
      catch (err) {
        println(err);
      }
      // Check whether the menu code is the same.
      if (code !== rl.currMenu.code) return;
      await sleep(200);
      const str = rl.currMenu.code === 0 ? '0. Exit Launcher' : '0. Go back to the homepage';
      println(`\n${str}`);
      rl.prompt();
    }
  });

  await printHomepage();

}

// MAIN FUNCTION
(async function main() {
  cls(0, 0);
  await sleep(200);
  printHeader();
  await sleep(200);

  // Kinda hacky but whatever :P
  // This here sorta checks to make sure everything is in place
  // before trying to start the launcher.
  const dir = fs.readdirSync('.');

  if (dir.includes('data') && dir.includes('bin') && dir.includes('node_modules')) {
    const bin = fs.readdirSync('./bin');
    let data = [];
    try {
      data = fs.readdirSync('./data/core');
    }
    catch(err) {
      println('The directory ./data/core seems to be missing. Please make\n' +
              'sure you installed Citrine correctly and try again.');
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
        if (!finished) {
          rl.close();
          return;
        }

        println('Please restart the launcher. If problems persist, you\n' +
                'can visit the official support server for more help:\n' +
                'Support Server: https://discord.gg/rEM9gFN');
        return;
      }
      else {
        println('\nAlright then. Please make sure Citrine is installed properly\n' +
                'on your device, and then try running the launcher again.');
        rl.close();
        return;
      }
    }
  }
  else {
    println('Hello there! Seems like this is your first time running Citrine!');
    await sleep();

    // Obtain the bot token
    let TOKEN = await input('Please insert your bot token. If it is stored\n' +
                            'on your path, simply enter PATH:<VARIABLE>');

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
    const finished = await compileCitrine();
    if (!finished) {
      rl.close();
      return;
    }

    try {
      println('Creating path: ./data/core');
      const path = './data/core';
      fs.mkdirSync(path, { recursive: true });

      println('Creating file: ./data/core/_settings.json');
      const _settings = JSON.stringify({ TOKEN, prefix }, null, '\n\t');
      fs.writeFileSync('./data/core/_settings.json', _settings);

      if (!dir.includes('start_citrine.bat')) {
        println('Creating file: ./start_citrine.bat');
        const start_citrine = '@echo off\n' +
                              'REM Execute citrine.js\n\n' +
                              'cls\n' +
                              'title Citrine Launcher\n\n' +
                              'echo --------------\n' +
                              'echo %DATE%' +
                              'echo --------------\n' +
                              'node ./bin/citrine.js\n' +
                              'pause\n';
        fs.writeFileSync('./start_citrine.bat', start_citrine);
      }
    }
    catch (err) {
      println('Error creating files.');
      println(err);
      await sleep();
      println('You may configure the files manually and try again.\n' +
              'If the problem persists, you can visit the official\n' +
              'support server for more help:\n' +
              'Support Server: https://discord.gg/rEM9gFN');
      rl.close();
      return;
    }

    try {
      println('Installing dependencies. . .');
      await execute('npm install', { cwd: process.cwd() });
    }
    catch (err) {
      println(err);
      println('Error installing dependencies.\n\n' +
              'You can try running `npm install` to manually install dependencies.\n' +
              'If a problem persists, you can visit the support server for help.\n' +
              'Support Server: https://discord.gg/rEM9gFN');
      rl.close();
      return;
    }
    // Start the launcher!
    println('\nStarting launcher. . .');
    await sleep();
    await startLauncher();

  }
})();
