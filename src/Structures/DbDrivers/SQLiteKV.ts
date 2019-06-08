import { resolve } from 'path';
import { IDbDriver, IDbConnection } from 'typings';
import { KeyvWrapper } from './Utils/KeyvWrapper';

export class SQLiteKV implements IDbDriver {
    [key: string]: any;

    public connect(name: string, path: string): IDbConnection {
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
