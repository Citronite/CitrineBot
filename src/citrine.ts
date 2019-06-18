import { CitrineClient } from './Structures/CitrineClient';
import { ICitrineOptions } from 'typings';

/*
 *       CitrineBot - A powerful, modular discord bot!
 *
 *       By @quantomistro (https://github.com/quantomistro)
 *       GitHub: https://github.com/quantomistro/CitrineBot
 *       Support Server: https://discord.gg/rEM9gFN
 *
 *       ###############################
 *       #                             #
 *       #     C  I  T  R  I  N  E     #
 *       #                             #
 *       ###############################
 */

const options: ICitrineOptions = {
  disableEveryone: true,
  disabledEvents: ['TYPING_START'],
  defaultChips: ['utils']
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

process.on('uncaughtException', citrine.logger.error);
process.on('unhandledRejection', citrine.logger.error);
process.on('exit', code =>
  citrine.logger.warn(`Process exited with code ${code}`)
);
