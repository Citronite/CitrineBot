const fs = require('fs');
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
const HomeMenu = require('./Menus/HomeMenu.js');
const Home = new HomeMenu();

async function printHomepage() {
	cls(0, 0);
	printHeader();
	await sleep(500);
	await printMenu(Home);
}

async function startLauncher() {
	rl.on('line', async (line) => {
		line = line.trim();

		if (!line || /\D/g.test(line)) {
			rl.prompt();
			return;
		}

		if (line === '0') {
			if (rl.currMenu.code === 0) {
				rl.close();
			}
			else {
				await printHomepage();
			}
		}
		else {
			cls();
			println('');
			await rl.currMenu.run(line);
		}
	});

	await printHomepage();

}

// Somehow check if its a first run or not.
// If so, do firstRunSetup();
// Otherwise, startLauncher();

// Start Launcher

const dir = fs.readdirSync('.');

(async () => {
	if (dir.includes('bin')) {
		const bin = fs.readdirSync('./bin');
		if (bin.includes('citrine.js')) {
			await startLauncher();
		}
		else {
			cls(0, 0);
			await sleep(500);

			printHeader();

			await sleep();
			const recompile = await confirm('It seems like you are missing some important files in your bin folder.\nWould you like to try re-compiling Citrine?');

			if (recompile) {
				println('\nPlease wait . . .');
				// Delete bin folder, recompile source code
				// Ask to restart launcher
			}
			else {
				println('\nAlright. Please make sure Citrine is installed properly on your device,\nand then try running the launcher again.');
				rl.close();
			}
		}
	}
	else {
		cls(0, 0);
		printHeader();

		await sleep(500);
		println('Hello there! Seems like this is your first time running Citrine!');

		await sleep();
		await input('First, please insert your bot token. If it is stored\non your path, simply enter PATH:<VARIABLE_NAME>');

		// Do stuff with token here

		await input('Please choose a global prefix for your bot:');

		// Store prefix in settings.

		println('\nStarting launcher. . .');
		await sleep(500);
		await startLauncher();
	}
})();
