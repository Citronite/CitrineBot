const fs = require('fs');
const { exec } = require('child_process');
// const path = require('path');
const HomeMenu = require('./Menus/HomeMenu.js');
const Home = new HomeMenu();
const {
	cls,
	sleep,
	printHeader,
	println,
	input,
	confirm,
	rl,
	printMenu,
} = require('./cli.js');

// Promisified version of child_process.exec()
function execute(...args) {
	return new Promise((res, rej) => {
		exec(...args, (err, stdout, stderr) => {
			if (err) return rej(err);
			return res({ stdout, stderr });
		});
	});
}

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
		println('Please make sure Citrine is installed properly, and try again');
		return false;
	}
}

// Add the line event listener, and prints the homepage
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
			// Otherwise, simply go back to the homepage
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

const dir = fs.readdirSync('.');

(async () => {
	// If the directory includes the bin folder, it means
	// source code was already compiled
	if (dir.includes('data') && dir.includes('bin')) {
		const bin = fs.readdirSync('./bin');
		const data = fs.readdirSync('./data/core');
		// Just a very minimal check to see if the main file was compiled
		if (bin.includes('citrine.js') && data.includes('_settings.json')) {
			await startLauncher();
		}
		else {
			cls(0, 0);
			await sleep();
			printHeader();
			await sleep();

			const recompile = await confirm('It seems like you are missing some important files in your bin folder.\nWould you like to try re-compiling Citrine?');

			if (recompile) {
				const successful = await compileCitrine();
				if (!successful) return;
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

		let TOKEN = await input('Please insert your bot token. If it is stored\non your path, simply enter PATH:<VARIABLE>');
		if (TOKEN.startsWith('PATH:')) {
			TOKEN = process.env[TOKEN.slice(5)];
		}

		const prefix = await input('Please choose a global prefix for your bot:');

		const successful = await compileCitrine();
		if (!successful) return;

		try {
			const _DB = require('../bin/Structures/CitrineStructs/CitrineDB.js');
			const _Settings = require('../bin/Structures/CitrineStructs/CitrineSettings.js');
			await _DB.initialSetup();
			await _Settings.initialSetup(TOKEN, prefix);

			println('Successfully initialized databases and settings for Citrine!');
		}
		catch (err) {
			println('Unknown error occurred while trying to initialize bot settings.');
			println(err);
			println('Please make sure Citrine is installed properly, and try again');
			return;
		}
		// Store prefix in settings.

		println('\nStarting launcher. . .');
		await sleep();
		await startLauncher();

	}
})();
