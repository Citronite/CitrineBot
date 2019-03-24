const Menu = require('./Menu.js');
const { println } = require('../cli.js');

class GuidesMenu extends Menu {
	constructor() {
		super({
			title: 'What would you like to view?',
			choices: [
				'Citrine Installation Guides',
				'Citrine Documentation',
				'Discord.js Documentation',
				'Node.js Documentation',
				'Discord.js Official Guide',
				'Node.js Official Guide',
				'JavaScript Guide',
				'TypeScript Guide',
			],
		});
		this.code = 2;
	}

	1() { println('Citrine Installation Guides');	}
	2() { println('Citrine Documentation'); }
	3() { println('Discord.js Documentation'); }
	4() { println('Node.js Documentation'); }
	5() { println('Discord.js Official Guide'); }
	6() { println('Node.js Official Guide'); }
	7() { println('JavaScript Guide'); }
	8() { println('TypeScript Guide'); }
}

module.exports = GuidesMenu;
