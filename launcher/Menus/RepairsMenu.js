const Menu = require('./Menu.js');
const { println } = require('../cli.js');

class RepairsMenu extends Menu {
	constructor() {
		super({
			title: 'What would you like to do?',
			choices: [
				'Recompile source code',
				'Reinstall dependencies',
				'Reinstall modules',
				'Delete modules',
				'Full reinstallation',
			],
		});

		this.code = 1;
	}

	1() { println('Recompile'); }
	2() { println('Reinstall deps'); }
	3() { println('Reinstall modules'); }
	4() { println('Delete modules'); }
	5() { println('Full reinstallation'); }
}

module.exports = RepairsMenu;
