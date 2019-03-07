import { djsUtils } from '../Utils/djsUtils';
import { jsUtils } from '../Utils/jsUtils';
import { CmdHandler } from './CmdHandler';
import { PermHandler } from './PermHandler';

export class CitrineUtils {
	public CmdHandler: CmdHandler;
	public PermHandler: PermHandler;
	public djs: djsUtils;
	public js: jsUtils;

	constructor() {
		this.CmdHandler = CmdHandler;
		this.PermHandler = PermHandler;
		this.djs = djsUtils;
		this.js = jsUtils;
	}
}