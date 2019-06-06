import { CitrineClient } from '../Structures/CitrineClient';

module.exports = {
  name: 'ready',
  listener: (client: CitrineClient) => {
    client.logger.info(`${client.user.tag} is online!\n`);
  },
  once: async (client: CitrineClient) => {
    const app = await client.fetchApplication();
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
    client.logger.info('\n(Note: Closing this window will also shut down the bot!)\n');
  }
};
