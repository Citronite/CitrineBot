import { DbDriver, DbConnection } from 'typings';
import { MapWrapper } from './Utils/MapWrapper';

export class Memory implements DbDriver {
  [key: string]: any;

  public connect(name: string): DbConnection {
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
