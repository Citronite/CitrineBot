import { DjsUtils } from '../../Utils/DjsUtils';
import { JsUtils } from '../../Utils/JsUtils';

export class CitrineUtils {
	public djs: DjsUtils;
	public js: JsUtils;

	constructor() {
		this.djs = DjsUtils;
		this.js = JsUtils;
	}
}
