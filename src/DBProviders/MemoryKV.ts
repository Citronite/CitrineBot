import { IDbProvider, IDbConnection } from 'typings';
import { KeyvWrapper } from './Utils/KeyvWrapper';

export class MemoryKV implements IDbProvider {
  [key: string]: any;

  public connect(name: string): IDbConnection {
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
