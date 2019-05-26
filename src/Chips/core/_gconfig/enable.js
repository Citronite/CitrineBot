const { SubCommand } = require('../../../exports');

class Enable extends SubCommand {
    constructor() {
        super({
            name: 'enable',
            description: 'Lol',
            usage: ''
        });
    }
}

module.exports = new Enable();
