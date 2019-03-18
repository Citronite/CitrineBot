interface ModuleMetaData {
	author: string;
	name: string;
	description: string;
}

export class Module {
	public readonly meta: object;
	public readonly namespace: string;
	constructor(metadata: object, dbNamespace: string) {
		this.meta = metadata;
		this.namespace = dbNamespace;
	}
}
