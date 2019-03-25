class AbstractMenu {
	constructor(options) {
		this.title = options.title;
		this.choices = options.choices;
	}

	async run(choice) {
		const func = this[parseInt(choice)];
		func[Symbol.toStringTag] === 'AsyncFunction' ? await func() : func();
	}
}

module.exports = AbstractMenu;
