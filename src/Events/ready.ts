import CitrineClient from '../Structures/CitrineClient';

module.exports = {
  name: 'ready',
  listener: (client: CitrineClient) => {
    client.logger.info(`${client.user.tag} is online!\n`);
  },
  once: async (client: CitrineClient) => {
    const name = client.user.tag;
    const servers = client.guilds.size;
    const invite = await client.generateInvite();
    const app = await client.fetchApplication();

    console.log(`=====${'='.repeat(name.length)}=====`);
    console.log(`     ${name}   `);
    console.log(`=====${'='.repeat(name.length)}=====\n`);

    console.log(`Active in     : ${servers} ${servers === 1 ? 'server' : 'servers'}`);
    console.log(`Bot Owner     : ${app.owner.tag}`);
    console.log(`Global Prefix : ${client.settings.globalPrefix}`);
    console.log(`Invite Link:\n${invite}`);
    console.log('\n(Note: Closing this window will also shut down the bot!)\n');

    /*
    const table = {};
    table[name] = {
      'Active in': `${servers} ${servers === 1 ? 'server' : 'servers'}`,
      'Bot Owner': app.owner.tag,
      'Global Prefix': client.settings.globalPrefix
    };
    console.table(table);
    */
  }
};
