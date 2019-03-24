const readline = require('readline');

const prompt = '-> ';
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt,
	// removeHistoryDuplicates: true
});

rl.currMenu = undefined;

function println(str) {
	console.log(str + '\n');
}

function print(...args) {
	console.log(...args);
}

async function sleep(time = 1000) {
	return new Promise((res) => {
		setTimeout(() => {
			res();
		}, time);
	});
}

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

function input(str) {
	return new Promise((res) => {
		rl.question(`\n${str}\n${prompt}`, (ans) => {
			res(ans);
			return;
		});
	});
}

async function confirm(str) {
	while (true) {
		const ans = await input(str);
		if (['yes', 'y'].includes(ans.toLowerCase())) return true;
		if (['no', 'n'].includes(ans.toLowerCase())) return false;
	}
}

function cls(x = 0, y = 8) {
	readline.cursorTo(process.stdout, x, y);
	readline.clearScreenDown(process.stdout);
}

async function printMenu(menu) {
	if (!menu) return;

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
