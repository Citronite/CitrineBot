import DjsUtils from '../Utils/DjsUtils';
import Formatter from '../Utils/Formatter';

export default class CitrineUtils {
  public readonly djs: DjsUtils;
  public readonly format: Formatter;

  public constructor() {
    this.djs = new DjsUtils();
    this.format = new Formatter();
  }
}
