import { CitrineClient } from './Structures/CitrineClient';
import { ClientOptions } from 'discord.js';

/*
*     CitrineBot - A powerful, open-source, modular
*         discord bot, built with developer and
*              user experience in mind!
*
*	               By @Quantomistro3178
*      GitHub: https://github.com/Quantomistro3178
*	     Support Server: https://discord.gg/rEM9gFN
*
*           ###############################
*           #                             #
*           #     C  I  T  R  I  N  E     #
*           #                             #
*           ###############################
*/

const defaultChips: string[] = ['dev-utils'];

const options: ClientOptions = {
  disableEveryone: true,
  disabledEvents: ['TYPING_START']
};

const citrine = new CitrineClient(options);

(async function main() {
  try {
    citrine.initChips(defaultChips);
    citrine.initEvents();
    await citrine.launch();
  } catch (_) {
    process.exit(1);
  }
})();

process.on('uncaughtException', err => citrine.logger.error(err));
process.on('unhandledRejection', err => citrine.logger.error(err));
process.on('exit', code => citrine.logger.warn(`Process exited with code ${code}`));
