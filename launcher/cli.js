const readline = require('readline');
const AbstractMenu = require('./Menus/AbstractMenu.js');

const prompt = '-> ';
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt,
	// removeHistoryDuplicates: true
});

// Keep track of the current Menu being displayed in the console
rl.currMenu = undefined;

// Simple shorthand function for console.log
function println(str) {
	console.log(`${str}\n`);
}

// Another rather redundant shorthand :P
function print(...args) {
	console.log(...args);
}

// Useful sleep function for better UX
async function sleep(time = 1000) {
	return new Promise((res) => {
		setTimeout(() => {
			res();
		}, time);
	});
}

// Self-explanatory
function printHeader() {
	console.log('\n' +
	'\t#############################\n' +
	'\t#                           #\n' +
	'\t#      - - Welcome - -      #\n' +
	'\t#                           #\n' +
	'\t#    C  I  T  R  I  N  E    #\n' +
	'\t#                           #\n' +
	'\t#############################\n');
}

// Obtain user input.
function input(str) {
	return new Promise((res) => {
		rl.question(`\n${str}\n${prompt}`, (ans) => {
			res(ans);
			return;
		});
	});
}

// For yes/no questions
async function confirm(str) {
	// Basically an infinite loop, only stops after receiving proper input
	while (str) {
		const ans = await input(str);
		if (['yes', 'y'].includes(ans.toLowerCase())) return true;
		if (['no', 'n'].includes(ans.toLowerCase())) return false;
	}
}

// Clear console screen. By default, it clears everything BELOW the header
// Use cls(0, 0) to clear the whole screen
function cls(x = 0, y = 8) {
	readline.cursorTo(process.stdout, x, y);
	readline.clearScreenDown(process.stdout);
}

// Takes a Menu (must be instance of an extension of the AbstractMenu class)
// and prints it to console.
// Also sets rl.currMenu to that menu. This, along with <Menu>.code can be helpful
// For identifying which menu is currently displayed to the user.
async function printMenu(menu) {
	if (!menu) return;
	if (!(menu instanceof AbstractMenu)) return;

	println(menu.title);

	await sleep(500);

	let x = 1;
	for (const choice of menu.choices) {
		print(`${x}. ${choice}`);
		x++;
	}

	if (menu.code === 0) {
		print('\n0. Exit launcher\n');
	}
	else {
		print('\n0. Go back to the homepage\n');
	}

	rl.currMenu = menu;
	rl.prompt();
}

// Exports
module.exports = {
	print,
	println,
	rl,
	sleep,
	printHeader,
	printMenu,
	input,
	cls,
	confirm,
};
