import { CitrineClient } from './Structures/CitrineClient';
import { CitrineOptions } from 'typings';

/*
*       CitrineBot - A powerful, open-source,
*       modular discord bot, built with
*       developer and user experience in mind!
*
*	      By @Quantomistro3178
*       GitHub: https://github.com/Quantomistro3178
*	      Support Server: https://discord.gg/rEM9gFN
*
*       ###############################
*       #                             #
*       #     C  I  T  R  I  N  E     #
*       #                             #
*       ###############################
*/

const options: CitrineOptions = {
  disableEveryone: true,
  disabledEvents: ['TYPING_START'],
  defaultChips: ['dev-utils']
};

const citrine = new CitrineClient(options);

(async function main() {
  try {
    citrine.initChips();
    citrine.initEvents();
    await citrine.launch();
  } catch (_) {
    process.exit(1);
  }
})();

process.on('uncaughtException', err => citrine.logger.error(err));
process.on('unhandledRejection', err => citrine.logger.error(err));
process.on('exit', code => citrine.logger.warn(`Process exited with code ${code}`));
