import Keyv = require('keyv');
import { IDbConnection } from 'typings';

export class KeyvWrapper extends Keyv implements IDbConnection {
    constructor(...options: any[]) {
        super(...options);
    }

    public async create(key: string, value: any, ttl?: number): Promise<true> {
        return this.set(key, value, ttl);
    }

    public async read(key: string): Promise<any> {
        return this.get(key);
    }

    public async update(key: string, value: any, ttl?: number): Promise<true> {
        return this.set(key, value, ttl);
    }

    public async delete(key: string): Promise<true> {
        return this.delete(key);
    }
}
