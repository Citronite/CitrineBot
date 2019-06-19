import { DbDriver, DbConnection } from 'typings';
import { KeyvWrapper } from './Utils/KeyvWrapper';

export class MemoryKV implements DbDriver {
  [key: string]: any;

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
