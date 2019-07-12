import { resolve } from 'path';
import KeyvWrapper from './Utils/KeyvWrapper';
import { DbProvider, DbConnection } from 'typings';

export default class SQLiteKV implements DbProvider {
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
