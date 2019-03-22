import { DjsUtils } from '../../Utils/DjsUtils';
import { JsUtils } from '../../Utils/JsUtils';
import { Formatter } from '../../Utils/Formatter';
import { IDjsUtils, IJsUtils, IFormatter } from 'typings';

export class CitrineUtils {
	public readonly djs: IDjsUtils;
	public readonly js: IJsUtils;
	public readonly format: IFormatter;

	constructor() {
		this.djs = DjsUtils;
		this.js = JsUtils;
		this.format = Formatter;
	}
}
