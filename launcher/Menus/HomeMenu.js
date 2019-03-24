const Menu = require('./Menu.js');
const RepairsMenu = require('./RepairsMenu.js');
const GuidesMenu = require('./GuidesMenu.js');
const CLI = require('../cli.js');

const { println, printMenu, sleep } = CLI;
const Repairs = new RepairsMenu();
const Guides = new GuidesMenu();

class HomeMenu extends Menu {
	constructor() {
		super({
			title: 'Welcome to the Citrine Launcher! What would you like to do?',
			choices: [
				'Launch Citrine',
				'Repairs / Maintenance',
				'View Guides / Documentations',
				'View Credits',
				'View License',
			],
		});
		this.code = 0;
	}

	async 1() {
		CLI.rl.currMenu = { code: 9 };

		await sleep(500);
		println('Launch Citrine');

		await sleep(500);
		println('0. Go back to the homepage');

		CLI.rl.prompt();
	}

	2() { printMenu(Repairs); }

	3() { printMenu(Guides); }

	async 4() {
		CLI.rl.currMenu = { code: 9 };

		await sleep(500);
		println('Show Credits (or just link to github repo)');

		await sleep(500);
		println('0. Go back to the homepage');

		CLI.rl.prompt();
	}

	async 5() {
		CLI.rl.currMenu = { code: 9 };

		await sleep(500);
		println('Show License (or just link to github repo)');

		await sleep(500);
		println('0. Go back to the homepage');

		CLI.rl.prompt();
	}
}

module.exports = HomeMenu;
