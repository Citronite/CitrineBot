const { SubCommand } = require('../../../exports');

class Enable extends SubCommand {
    constructor() {
        super({
            name: 'enable',
            description: 'Lol',
            usage: '[p]enable <...command>'
        });
    }
}

module.exports = new Enable();
