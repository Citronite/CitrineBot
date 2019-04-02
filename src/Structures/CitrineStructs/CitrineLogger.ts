import * as winston from 'winston';
import { CitrineClient } from '../CitrineClient';

export class CitrineLogger {
  public readonly client: CitrineClient;

  constructor(client: CitrineClient) {
    // Implement this :P

    this.client = client;
  }

  public error(str: string | Error): void {
    return;
  }

  public info(str: string): void {
    return;
  }

  public warn(str: string): void {
    return;
  }

  public log(str: string): void {
    return;
  }
}
