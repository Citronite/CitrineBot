import { CitrineClient } from './Structures/CitrineClient';
import { ClientOptions } from 'discord.js';

/*
*    CitrineBot - A powerful, open-source, modular
*        discord bot, built with developer and
*             user experience in mind!
*
*	    By @PandaHappy 🍂#8851 | @Quantomistro3178
*	       Discord: https://discord.gg/rEM9gFN
*     GitHub: https://github.com/Quantomistro3178
*
*          ###############################
*          #                             #
*          #     C  I  T  R  I  N  E     #
*          #                             #
*          ###############################
*/

const defaultChips: string[] = [];

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
  } catch (err) {
    process.exit(1);
  }
})();

citrine.on('error', err => citrine.logger.error('Connection error...'));
citrine.on('ready', () => citrine.logger.info('Ready!'));
citrine.on('reconnecting', () => citrine.logger.info('Reconnecting...'));
process.on('uncaughtException', err => citrine.logger.error(err));
process.on('unhandledRejection', err => citrine.logger.error(err));
