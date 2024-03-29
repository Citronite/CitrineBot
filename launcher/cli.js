const readline = require('readline');
const { exec } = require('child_process');
const AbstractMenu = require('./Menus/AbstractMenu.js');

const prompt = '-> ';
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt
  // removeHistoryDuplicates: true
});

// Keep track of the current Menu being displayed in the console
rl.currMenu = undefined;

// Shorthand for console.log
function println(str) {
  console.log(`${str}\n`);
}

// Prints header
function printHeader() {
  console.log(
    '\n' +
      '\t#############################\n' +
      '\t#                           #\n' +
      '\t#      - - Welcome - -      #\n' +
      '\t#                           #\n' +
      '\t#    C  I  T  R  I  N  E    #\n' +
      '\t#                           #\n' +
      '\t#############################\n'
  );
}

// Useful sleep function
async function sleep(time = 1000) {
  return new Promise(res => {
    setTimeout(() => {
      res();
    }, time);
  });
}

// Obtain user input.
function input(str) {
  return new Promise(res => {
    rl.question(`\n${str}\n${prompt}`, ans => {
      res(ans.trim());
    });
  });
}

// For yes/no questions
async function confirm(str) {
  while (str) {
    const ans = await input(str);
    if (['yes', 'y', 'true', 't', '1'].includes(ans.toLowerCase())) return true;
    if (['no', 'n', 'false', 'f', '0'].includes(ans.toLowerCase())) return false;
  }
}

// Takes a Menu (must be instance of the AbstractMenu class)
// and prints it to console.
// Also sets rl.currMenu to that menu. This, along with <Menu>.code can be helpful
// For identifying which menu is currently displayed to the user.
async function printMenu(menu) {
  if (!menu || !(menu instanceof AbstractMenu)) {
    throw new Error('Invalid Menu provided!');
  }

  println(menu.title);
  await sleep(100);

  let x = 1;
  for (const choice of menu.choices) {
    console.log(`${x}. ${choice}`);
    x++;
  }
  rl.currMenu = menu;
}

// Clear console screen. By default, it clears everything BELOW the header
// Use cls(0, 0) to clear the whole screen
function cls(x = 0, y = 8) {
  readline.cursorTo(process.stdout, x, y);
  readline.clearScreenDown(process.stdout);
}

// Promisified version of child_process.exec()
function execute(...args) {
  return new Promise((res, rej) => {
    exec(...args, (err, stdout, stderr) => {
      if (err) rej(err);
      else res({ stdout, stderr });
    });
  });
}

async function open(arg, options) {
  const cmd =
    process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  await execute(`${cmd} ${arg}`, options);
}

// Exports
module.exports = {
  println,
  rl,
  sleep,
  printHeader,
  printMenu,
  input,
  cls,
  confirm,
  execute,
  open
};
