const { resolve } = require('path');

const path = resolve(`${__dirname}/../../../data/core/guilds.sqlite`);
console.log(path);

module.exports = {
    load: (client) => {
        client.db.connect('guilds', path);
    },
	unload: (client) => {
        client.db.disconnect('guilds');
    }
};
