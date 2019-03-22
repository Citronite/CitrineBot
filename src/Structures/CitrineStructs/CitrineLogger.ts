import * as winston from 'winston';
import { CitrineClient } from '../CitrineClient';

export class CitrineLogger {
	public readonly client: CitrineClient;

	constructor(client: CitrineClient) {
		// Implement this :P

		this.client = client;
	}

	public error(): void {
		return;
	}

	public info(): void {
		return;
	}

	public warn(): void {
		return;
	}

	public log(): void {
		return;
	}
}
