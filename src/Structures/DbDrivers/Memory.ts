import MapWrapper from './Utils/MapWrapper';
import { DbProvider, DbConnection } from 'typings';

export default class Memory implements DbProvider {
  [key: string]: any;

  public readonly type: 'Memory';

  public constructor() {
    this.type = 'Memory';
  }

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
