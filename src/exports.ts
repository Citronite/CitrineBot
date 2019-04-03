import { BaseCommand } from './Structures/CommandStructs/BaseCommand';
import { SubCommand } from './Structures/CommandStructs/SubCommand';
import { BaseError } from './Structures/ErrorStructs/BaseError';
import { CommandError } from './Structures/ErrorStructs/CommandError';
import { ErrorCodes } from './Structures/ErrorStructs/ErrorCodes';
import { QuickEmbed } from './Utils/QuickEmbed';
import { Colours, Colors } from './Utils/Constants';
import * as promisefs from './Utils/promisefs';

module.exports = {
  BaseCommand,
  SubCommand,
  BaseError,
  CommandError,
  ErrorCodes,
  QuickEmbed,
  Colours,
  Colors,
  promisefs
};
