const { spawnSync } = require('child_process');
const { resolve } = require('path');
const AbstractMenu = require('./AbstractMenu.js');
const ChipsMenu = require('./ChipsMenu.js');
const RepairsMenu = require('./RepairsMenu.js');
const GuidesMenu = require('./GuidesMenu.js');
const CreditsMenu = require('./CreditsMenu.js');
const { cls, println, printMenu, sleep } = require('../cli.js');

const Chips = new ChipsMenu();
const Repairs = new RepairsMenu();
const Guides = new GuidesMenu();
const Credits = new CreditsMenu();

const root = resolve(`${__dirname}/../../`);

class HomeMenu extends AbstractMenu {
    constructor() {
        super({
            title:
                'Welcome to the Citrine Launcher! What would you like to do?',
            choices: [
                'Launch Citrine',
                'Manage Chips',
                'Repairs / Maintenance',
                'View Guides / Documentations',
                'View Credits / License'
            ]
        });
        this.code = 0;
    }

    async 1() {
        cls(0, 0);
        await sleep(200);
        println('Launching Citrine. . .');
        try {
            const options = {
                cwd: root,
                shell: true,
                stdio: 'inherit'
            };
            await spawnSync('node', [`${root}/bin/citrine.js`], options);
        } catch (err) {
            println(err);
        }
    }

    2() {
        printMenu(Chips);
    }

    3() {
        printMenu(Repairs);
    }

    4() {
        printMenu(Guides);
    }

    5() {
        printMenu(Credits);
    }
}

module.exports = HomeMenu;
