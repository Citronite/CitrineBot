import { DjsUtils } from '../Utils/DjsUtils';
import { JsUtils } from '../Utils/JsUtils';
import { CmdHandler } from '../Handlers/CmdHandler';
import { PermHandler } from '../Handlers/PermHandler';

export class CitrineUtils {
	public CmdHandler: CmdHandler;
	public PermHandler: PermHandler;
	public djs: DjsUtils;
	public js: JsUtils;

	constructor() {
		this.CmdHandler = CmdHandler;
		this.PermHandler = PermHandler;
		this.djs = DjsUtils;
		this.js = JsUtils;
	}
}
