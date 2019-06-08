import { DjsUtils } from '../../Utils/DjsUtils';
import { Formatter } from '../../Utils/Formatter';
import { IDjsUtils, IFormatter } from 'typings';

export class CitrineUtils {
    public readonly djs: IDjsUtils;
    public readonly format: IFormatter;

    constructor() {
        this.djs = DjsUtils;
        this.format = Formatter;
    }
}
