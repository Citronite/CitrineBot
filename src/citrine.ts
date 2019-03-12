import { CitrineClient } from './Structures/CitrineClient';
import { ClientOptions } from 'discord.js';

/*
*							By @Quantomistro3178
*					Discord: PandaHappy 🍂#8851
*	  GitHub: https://github.com/Quantomistro3178
*
*					###############################
*					#                             #
*					#     C  I  T  R  I  N  E     #
*					#                             #
*					###############################
*/

const defaultModules = ['dev-utils'];

const options: ClientOptions = {
	disableEveryone: true,
	disabledEvents: ['TYPING_START']
};

const TOKEN = 'temp var here, otherwise the .launch() will handle the token stuff :P';

const citrine = new CitrineClient(options);

(async () => {
	try {
		citrine.initModules(defaultModules);
		citrine.initEvents();
		citrine.initDB();

		await citrine.launch(TOKEN);
		console.log('- - - Citrine launched successfully! - - -');

	} catch (err) {
		process.exit(1);
	}
})();
