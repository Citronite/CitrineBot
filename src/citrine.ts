import CitrineClient from './Structures/CitrineClient';

/*
 *       CitrineBot - A powerful & extensible Discord bot!
 *
 *       By @quantomistro (https://github.com/quantomistro)
 *       GitHub: https://github.com/Citronite/CitrineBot
 *       Support Server: https://discord.gg/yyqjd3B
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
  defaultChips: ['all'],
  dbDriver: 'Memory'
};

const citrine = new CitrineClient(options);

(async function main() {
  try {
    await citrine.launch();
  } catch (_) {
    process.exit(1);
  }
})();

process.on('uncaughtException', citrine.logger.error);
process.on('unhandledRejection', citrine.logger.error);
process.on('exit', code => citrine.logger.warn(`Process exited with code ${code}`));
