import { CitrineClient } from '../Structures/CitrineClient';
import { OAuth2Application } from 'discord.js';

module.exports = {
  name: 'ready',
  listener: (client: CitrineClient) => {
    client.logger.info(`${client.user.tag} is online!`);
  },
  once: async (client: CitrineClient) => {
    const app: OAuth2Application = await client.fetchApplication();
    const name = client.user.tag;
    const inv = await client.generateInvite();

    console.log(` ===${'='.repeat(name.length)}===`);
    console.log(`    ${name}   `);
    console.log(` ===${'='.repeat(name.length)}===`);

    console.log('\n');
    console.log(`${client.user.username} is active in ${client.guilds.size} server(s)!`);
    console.log(`Global Prefix: ${client.settings.globalPrefix}`);
    console.log(`Bot Owner: ${app.owner.tag}`);
    console.log('Invite Link:');
    console.log(inv);
  }
};
