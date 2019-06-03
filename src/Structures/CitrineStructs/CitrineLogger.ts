// import * as winston from 'winston';

export class CitrineLogger {
  public info(str: string): void {
    console.log(str);
  }

  public warn(str: string): void {
    console.log(str);
  }

  public error(err: string | Error): void {
    console.log(err);
  }
}
