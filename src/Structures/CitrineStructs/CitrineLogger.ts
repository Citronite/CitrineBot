import * as winston from 'winston';
import { CitrineClient } from '../CitrineClient';

export class CitrineLogger {
  public readonly client: CitrineClient;

  constructor(client: CitrineClient) {
    this.client = client;
  }

  public error(err: string | Error): void {
    console.log(err);
  }

  public info(str: string): void {
    console.log(str);
  }

  public warn(str: string): void {
    console.log(str);
  }
}
