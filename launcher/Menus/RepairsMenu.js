const AbstractMenu = require('./AbstractMenu.js');
const { println, execute, rl } = require('../cli.js');
const fs = require('fs');
const { resolve } = require('path');

const root = resolve(`${__dirname}/../../`);

class RepairsMenu extends AbstractMenu {
    constructor() {
        super({
            title: 'What would you like to do?',
            choices: [
                'Recompile source code',
                'Reinstall dependencies',
                'Full reinstallation'
            ]
        });

        this.code = 2;
    }

    // Recompile TS code
    async 1() {
        println('Recompiling source code...');
        try {
            println('\nPlease wait...');
            try {
                const { stdout, stderr } = await execute(
                    'node_modules/.bin/tsc',
                    { cwd: root }
                );
                if (stderr) println(stderr);
                if (stdout) println(stdout);
            } catch (_) {
                const { stdout, stderr } = await execute('tsc', {
                    cwd: root
                });
                if (stderr) println(stderr);
                if (stdout) println(stdout);
            }
            fs.readdirSync(`${root}/bin`);
            println('Successfully recompiled code!');
        } catch (err) {
            println('Uh-oh! An unknown error occurred while compiling code!');
            println(err);
            println(
                'Please make sure Citrine is installed properly, and try again.\n' +
                    'For further help, you can join the support server:\n' +
                    'Support Server: https://discord.gg/rEM9gFN'
            );
            rl.close();
            process.exit(1);
        }
    }

    // Reinstall npm dependencies
    2() {
        println('This feature is yet to be implemented!');
    }

    // Factory reset
    3() {
        println('This feature is yet to be implemented!');
    }
}

module.exports = RepairsMenu;
