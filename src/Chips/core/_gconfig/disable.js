const { SubCommand } = require('../../../exports');

class Disable extends SubCommand {
    constructor() {
      super({
        name: 'disable',
        description: 'Disable guilds/users/commands globally.',
        usage: '[p]gconfig disable <"guild" | "user" | "cmd">'
      });
    }
}

const g = require();
const u = require();
const c = require();
module.exports = new Disable().registerSubCommands();
