import { IDbConnection } from 'typings';
import Keyv = require('keyv');

export class KeyvWrapper extends Keyv implements IDbConnection {
  public constructor(...options: any[]) {
    super(...options);
  }

  public async create(key: string, value: any, ttl?: number): Promise<void> {
    return super.set(key, value, ttl);
  }

  public async read(key: string): Promise<any> {
    return super.get(key);
  }

  public async update(key: string, value: any, ttl?: number): Promise<void> {
    return super.set(key, value, ttl);
  }

  public async delete(key: string): Promise<void> {
    return super.delete(key);
  }
}
