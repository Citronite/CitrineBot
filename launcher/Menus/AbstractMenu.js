const { resolve } = require('path');

class AbstractMenu {
    constructor(options) {
        this.title = options.title;
        this.choices = options.choices;
        super.root = resolve(`${__dirname}/../..`);
    }

    // Execute which option the user chose in the launcher menu
    async run(choice) {
        const fn = this[parseInt(choice)];
        // Check if its an asynchronous function or not. If so, use await
        // otherwise just execute it normally :P
        if (!fn) return;
        fn[Symbol.toStringTag] === 'AsyncFunction' ? await fn() : fn();
    }
}

module.exports = AbstractMenu;
