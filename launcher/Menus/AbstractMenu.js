class AbstractMenu {
    constructor(options) {
        this.title = options.title;
        this.choices = options.choices;
        super.CWD = `${__dirname}/../..`;
    }

    // Execute which option the user chose in the launcher menu
    async run(choice) {
        const func = this[parseInt(choice)];
        // Check if its an asynchronous function or not. If so, use await
        // otherwise just execute it normally :P
        if (!func) return;
        func[Symbol.toStringTag] === 'AsyncFunction' ? await func() : func();
    }
}

module.exports = AbstractMenu;
