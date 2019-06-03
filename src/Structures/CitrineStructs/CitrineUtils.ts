import { DjsUtils as djs } from '../../Utils/DjsUtils';
import { Formatter as format } from '../../Utils/Formatter';
import { DjsUtils, Formatter } from 'typings';

export class CitrineUtils {
  public readonly djs: DjsUtils;
  public readonly format: Formatter;

  constructor() {
    this.djs = djs;
    this.format = format;
  }
}
