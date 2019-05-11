import { CitrineClient } from '../Structures/CitrineClient';
import { OAuth2Application } from 'discord.js';

module.exports = {
  name: 'ready',
  listener: (client: CitrineClient) => {
    client.logger.info(`${client.user.tag} is online!\n`);
  },
  once: async (client: CitrineClient) => {
    const app: OAuth2Application = await client.fetchApplication();
    const name = client.user.tag;
    const invite = await client.generateInvite();

    client.logger.info(`=====${'='.repeat(name.length)}=====`);
    client.logger.info(`     ${name}   `);
    client.logger.info(`=====${'='.repeat(name.length)}=====\n`);

    const servers = client.guilds.size;
    client.logger.info(`Active in     : ${servers} ${servers === 1 ? 'server' : 'servers'}`);
    client.logger.info(`Bot Owner     : ${app.owner.tag}`);
    client.logger.info(`Global Prefix : ${client.settings.globalPrefix}`);
    client.logger.info(`Invite Link:\n${invite}`);
    client.logger.info('\n(Note: Closing this window will shut down the bot as well!)\n');
  }
};
