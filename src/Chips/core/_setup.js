module.exports = {
    load: (client) => {
        client.db.connect('guilds', path);
    },
	unload: (client) => {
        client.db.disconnect('guilds');
    }
};
