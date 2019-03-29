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

const citrine = new CitrineClient(options);

(async () => {
	try {
		citrine.initChips(defaultModules);
		citrine.initEvents();
		citrine.initDB();

		await citrine.launch();
		console.log('- - - Citrine launched successfully! - - -');

	} catch (err) {
		process.exit(1);
	}
})();

process.on('uncaughtException', err => citrine.logger.error());
process.on('unhandledRejection', err => citrine.logger.error());
