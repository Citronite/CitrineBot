import { resolve } from 'path';
import { DbProvider, DbConnection } from 'typings';
import { KeyvWrapper } from './Utils/KeyvWrapper';

export class SQLiteKV implements DbProvider {
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
