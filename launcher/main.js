const fs = require('fs');
const { resolve } = require('path');
const HomeMenu = require('./Menus/HomeMenu.js');
const package = require('../package.json');
const {
  cls,
  sleep,
  printHeader,
  println,
  input,
  confirm,
  rl,
  printMenu,
  execute
} = require('./cli.js');

const Home = new HomeMenu();
const root = resolve(`${__dirname}/../`);

// Exit the launcher.
function exit(code = 0) {
  rl.close();
  process.exit(code);
}

// Print the homepage (the HomeMenu)
async function printHomepage() {
  cls();
  await sleep(100);
  println('');
  await printMenu(Home);
  println('\n0. Exit Launcher');
  rl.prompt();
}

// Obtain bot token
async function getToken() {
  let TOKEN = await input(
    'Please insert your bot token. If it is stored as\n' +
      'an environment variable, enter ENV:<VARIABLE>'
  );
  if (TOKEN.startsWith('ENV:')) TOKEN = process.env[TOKEN.slice(4)];
  while (!TOKEN) {
    TOKEN = await input('Please insert a valid bot token:');
    if (TOKEN.startsWith('ENV:')) TOKEN = process.env[TOKEN.slice(4)];
  }
  return TOKEN;
}

// Obtain global prefix for the bot
async function getInitialPrefix() {
  let prefix = await input('Please choose a global prefix for your bot:');
  while (!prefix) {
    prefix = await input('Please choose a valid prefix for your bot:');
  }
  return prefix;
}

// Install NPM Dependencies
async function installDeps() {
  try {
    println('Installing dependencies. . .');
    println('This may take several minutes. . .');

    const { stdout, stderr } = await execute('npm install --only=production', {
      cwd: root
    });
    if (stdout) println(stdout);
    if (stderr) println(stderr);
    // Check if it exists
    fs.readdirSync(`${__dirname}/../node_modules`);
    println('Dependencies installed successfully!');
    return true;
  } catch (err) {
    println(err);
    println(
      'Error installing dependencies.\n\n' +
        'You can try running `npm install --only=production` to manually install\n' +
        'the required dependencies. If a problem persists, you can visit the\n' +
        'support server for help: https://discord.gg/rEM9gFN'
    );
    return false;
  }
}

// Compiles code.
async function compileCitrine() {
  try {
    println('\nPlease wait...');
    try {
      const { stdout, stderr } = await execute('node_modules/.bin/tsc', {
        cwd: root
      });
      if (stderr) println(stderr);
      if (stdout) println(stdout);
    } catch (_) {
      // In case typescript is installed globally
      const { stdout, stderr } = await execute('tsc', { cwd: root });
      if (stderr) println(stderr);
      if (stdout) println(stdout);
    }
    // Check if it exists
    fs.readdirSync(`${root}/bin`);
    println('Successfully recompiled code!');
    return true;
  } catch (err) {
    println('Uh-oh! An unknown error occurred while compiling code!');
    println(err);
    println(
      'Please make sure Citrine is installed properly, and try again.\n' +
        'For further help, you can join the support server:\n' +
        'Support Server: https://discord.gg/rEM9gFN'
    );
    return false;
  }
}

// Create ./data and core/_instance.json
async function createDataFiles(TOKEN, initialPrefix) {
  try {
    // Create data directory
    const data = `${root}/data`;
    println('Creating path: data/core');
    fs.mkdirSync(`${data}/core`, { recursive: true });

    // Create _instance for storing token + prefix
    println('Creating file: data/core/_instance.json');
    const { version } = package;
    const content = JSON.stringify(
      { TOKEN, initialPrefix, version },
      null,
      '  '
    );
    fs.writeFileSync(`${data}/core/_instance.json`, content);
    // Check if it exists
    fs.readFileSync(`${data}/core/_instance.json`);
    println('Success!');
    return true;
  } catch (err) {
    println('Error creating files!');
    println(err);
    println(
      'You may configure the files manually and try again.\n' +
        'If the problem persists, you can visit the support\n' +
        'server for more help: https://discord.gg/rEM9gFN\n'
    );
    return false;
  }
}

// Adds the line event listener, and prints the homepage
async function startLauncher() {
  rl.on('line', async line => {
    line = line.trim();

    if (!line || /\D/g.test(line)) {
      rl.prompt();
      return;
    }
    if (line === '0') {
      // If the current menu is the homepage, then exit the launcher
      if (rl.currMenu.code === 0) {
        exit();
      }
      // Otherwise, go back to the homepage
      else {
        await printHomepage();
      }
    } else {
      cls();
      println('');
      // Run whatever option the user chose
      try {
        await rl.currMenu.run(line);
      } catch (err) {
        println(err);
      }
      await sleep(200);
      const str =
        rl.currMenu.code === 0
          ? '0. Exit Launcher'
          : '0. Go back to the homepage';
      println(`\n${str}`);
      rl.prompt();
    }
  });
  await printHomepage();
}

(async function main() {
  cls(0, 0);
  await sleep(200);
  printHeader();
  await sleep(200);

  const version = parseInt(process.version.split('.')[0].slice(1));
  if (version < 10) {
    println('Please update Node.js.');
    println('Citrine requires at least version 10 to run smoothly.');
    println(`You are running: ${process.version}`);
    exit(1);
  }

  // Kinda hacky but oh well :P
  const dir = fs.readdirSync(root);
  const firstRun =
    !dir.includes('data') &&
    !dir.includes('bin') &&
    !dir.includes('node_modules');

  if (firstRun) {
    println('Hello there! Seems like this is your first time running Citrine!');
    await sleep(500);

    // Obtain the bot token & global prefix
    const TOKEN = await getToken();
    const initialPrefix = await getInitialPrefix();

    // Install dependencies & compile code
    const installed = await installDeps();
    if (!installed) exit(1);

    const compiled = await compileCitrine();
    if (!compiled) exit(1);

    // Create data dir & files
    const created = await createDataFiles(TOKEN, initialPrefix);
    if (!created) exit(1);

    const { platform } = process;
    try {
      if (platform === 'win32') {
        if (dir.includes('start_citrine.bat')) return;

        println('Creating file: ./start_citrine.bat');
        const content =
          '@echo off\n' +
          'rem start citrine.js\n\n' +
          'cls\n' +
          'title Citrine Launcher\n\n' +
          'echo --------------\n' +
          'echo %DATE%' +
          'echo --------------\n' +
          `node ${root}/bin/citrine.js\n` +
          'pause\n';
        fs.writeFileSync(`${root}/start_citrine.bat`, content);
      } else if (platform === 'linux') {
        if (dir.includes('start_citrine.sh')) return;

        println('Creating file: ./start_citrine.sh');
        const content =
          '#!/bin/sh\n\n' +
          'echo -ne "\033]0;Citrine Launcher\007"\n' +
          'clear\n' +
          'echo -----------------------------\n' +
          'date\n' +
          'echo -----------------------------\n' +
          `node ${root}/bin/citrine.js\n` +
          'read -n1 -r -p "Press any key to continue..."\n';
        fs.writeFileSync(`${root}/start_citrine.sh`, content);
      } else {
        println(
          'Unsupported platform!\n' +
            'You can run `node ./bin/citrine.js` in your\n' +
            'console to directly launch citrine!'
        );
      }
    } catch (err) {
      const ext =
        platform === 'win32' ? '.bat' : platform === 'linux' ? '.sh' : null;
      if (!ext) {
        println(
          'Unsupported platform!\n' +
            'You may run `node ./bin/citrine.js` in your\n' +
            'console to directly launch citrine!'
        );
        return;
      }
      println(`Error creating file start_citrine${ext}`);
      println(err);
      println(
        'You may launch Citrine through the main launcher, or run\n' +
          '`node ./bin/citrine.js` to launch citrine directly.'
      );
      exit(1);
    }
    // Start the launcher!
    println('\nStarting launcher. . .');
    await sleep();
    await startLauncher();
  } else {
    // Check if any of the important directories are missing
    if (!dir.includes('data')) {
      // Create ./data again
      println('It seems like the ./data directory is missing.');
      const TOKEN = await getToken();
      const prefix = await getInitialPrefix();
      const created = await createDataFiles(TOKEN, prefix);
      if (!created) exit(1);
    }
    if (!dir.includes('bin')) {
      // Recompile.
      const str =
        'It seems like the ./bin directory is missing.\n' +
        'Would you like to try recompiling Citrine?';
      const recompile = await confirm(str);
      if (recompile) {
        const compiled = await compileCitrine();
        if (!compiled) exit(1);
      } else {
        println(
          'Alright. Please make sure Citrine is installed correctly and try again!'
        );
        exit();
      }
    }
    if (!dir.includes('node_modules')) {
      // Install npm dependencies again
      const str =
        'It seems like the ./node_modules directory is missing.\n' +
        'Would you like to try reinstalling the dependencies?';
      const reinstall = await confirm(str);
      if (reinstall) {
        const installed = await installDeps();
        if (!installed) exit(1);
      } else {
        println(
          'Alright. Please make sure Citrine is installed correctly and try again!'
        );
        exit();
      }
    }
    // Start Launcher!
    println('\nStarting launcher. . .');
    await sleep();
    await startLauncher();
  }
})();
