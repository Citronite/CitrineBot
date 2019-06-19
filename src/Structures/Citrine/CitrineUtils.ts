import DjsUtils from '../Utils/DjsUtils';
import Formatter from '../Utils/Formatter';
import {
  DjsUtils as IDjsUtils,
  Formatter as IFormatter
} from 'typings';

export default class CitrineUtils {
  public readonly djs: IDjsUtils;
  public readonly format: IFormatter;

  public constructor() {
    this.djs = new DjsUtils();
    this.format = new Formatter();
  }
}
