import { resolve } from 'path';
import { DbDriver, DbConnection } from 'typings';
import { KeyvWrapper } from './Utils/KeyvWrapper';

export class SQLiteKV implements DbDriver {
  [key: string]: any;

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
