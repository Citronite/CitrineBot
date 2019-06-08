import { IDbProvider, IDbConnection } from 'typings';
import { MapWrapper } from './Utils/MapWrapper';

export class Memory implements IDbProvider {
  [key: string]: any;

  public connect(name: string): IDbConnection {
    try {
      this[name] = new MapWrapper();
      return this[name];
    } catch (err) {
      throw err;
    }
  }

  public disconnect(name: string): void {
    delete this[name];
  }
}
