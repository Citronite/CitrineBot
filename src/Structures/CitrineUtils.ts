import { djsUtils } from '../Utils/djsUtils';
import { jsUtils } from '../Utils/jsUtils';
import { CmdHandler } from './CmdHandler';
import { PermHandler } from './PermHandler';

export class CitrineUtils {
	public CmdHandler: CmdHandler;
	public PermHandler: PermHandler;
	public djsUtils: djsUtils;
	public jsUtils: jsUtils;

	constructor() {
		this.CmdHandler = CmdHandler;
		this.PermHandler = PermHandler;
		this.djsUtils = djsUtils;
		this.jsUtils = jsUtils;
	}
}