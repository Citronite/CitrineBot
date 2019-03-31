import { CitrineClient } from '../Structures/CitrineClient';
import { OAuth2Application } from 'discord.js';

module.exports = {
  name: 'ready',
  maxListeners: 1,
  listener: async (client: CitrineClient) => {
    console.log('Logged in successfully!\n\n');

    const app: OAuth2Application = await client.fetchApplication();
    const name = client.user.tag;
    const inv = await client.generateInvite();

    console.log(`    ${'='.repeat(name.length)}`);
    console.log(`    ${name}`);
    console.log(`    ${'='.repeat(name.length)}`);

    console.log('\n\n');
    console.log(`Bot Owner: ${app.owner.tag}`);
    console.log('Invite Link:');
    console.log(inv);
  }
};
