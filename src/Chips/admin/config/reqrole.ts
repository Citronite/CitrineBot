import { SubCommand } from '../../../exports';

class ReqRole extends SubCommand {
	public constructor() {
		super({
			name: 'reqrole',
			description: 'Set required roles for commands, as an extra layer of security for commands!',
			usage: '[p]reqrole'
		})
	}

	public async execute() {
		throw [999, 'Not implemented yet!'];
	}
}

module.exports = new ReqRole();
