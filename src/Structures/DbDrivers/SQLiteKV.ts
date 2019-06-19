import { resolve } from 'path';
import { DbDriver, DbConnection } from 'typings';
import KeyvWrapper from './Utils/KeyvWrapper';

export default class SQLiteKV implements DbDriver {
  [key: string]: any;

  public readonly type: 'SQLiteKV';

  public constructor() {
    this.type = 'SQLiteKV';
  }

  public connect(name: string, path: string): DbConnection {
    try {
      this[name] = new KeyvWrapper(`sqlite://${resolve(path)}`);
      return this[name];
    } catch (err) {
      throw err;
    }
  }

  public disconnect(name: string): void {
    delete this[name];
  }
}
