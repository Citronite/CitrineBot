const AbstractMenu = require('./AbstractMenu.js');
const { rl, sleep, println } = require('../cli.js');

class CreditsMenu extends AbstractMenu {
	constructor() {
		super({
			title: 'What would you like to view?',
			choices: [
				'View Credits',
				'View License',
			],
		});

		this.code = 4;
	}

	async 1() {
		rl.currMenu = { code: 9 };

		await sleep(500);
		println('Show Credits (or just link to github repo)');

		await sleep(500);
		println('0. Go back to the homepage');

		rl.prompt();
	}

	async 2() {
		rl.currMenu = { code: 9 };

		await sleep(500);
		println('Show License (or just link to github repo)');

		await sleep(500);
		println('0. Go back to the homepage');

		rl.prompt();
	}
}

module.exports = CreditsMenu;
