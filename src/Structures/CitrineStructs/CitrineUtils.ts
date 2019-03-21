import { DjsUtils } from '../../Utils/DjsUtils';
import { JsUtils } from '../../Utils/JsUtils';
import { Formatter } from '../../Utils/Formatter';

export class CitrineUtils {
	public readonly djs: DjsUtils;
	public readonly js: JsUtils;
	public readonly format: Formatter;

	constructor() {
		this.djs = DjsUtils;
		this.js = JsUtils;
		this.format = Formatter;
	}
}
