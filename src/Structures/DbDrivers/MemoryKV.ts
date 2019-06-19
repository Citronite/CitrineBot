import { DbDriver, DbConnection } from 'typings';
import KeyvWrapper from './Utils/KeyvWrapper';

export default class MemoryKV implements DbDriver {
  [key: string]: any;

  public readonly type: 'MemoryKV';

  public constructor() {
    this.type = 'MemoryKV';
  }

  public connect(name: string): DbConnection {
    try {
      this[name] = new KeyvWrapper();
      return this[name];
    } catch (err) {
      throw err;
    }
  }

  public disconnect(name: string): void {
    delete this[name];
  }
}
