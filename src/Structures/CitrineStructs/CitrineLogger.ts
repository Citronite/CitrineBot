import * as winston from 'winston';
import { CitrineClient } from '../CitrineClient';

export class CitrineLogger {
  public readonly client: CitrineClient;

  constructor(client: CitrineClient) {
    // Implement this :P

    this.client = client;
  }

  public error(err: string | Error): void {
    console.log(err.toString());
  }

  public info(str: string): void {
    console.log(str.toString());
  }

  public warn(str: string): void {
    console.log(str.toString());
  }
}
