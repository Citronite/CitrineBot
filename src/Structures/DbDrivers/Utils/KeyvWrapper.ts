import Keyv = require('keyv');
import { DbConnection } from 'typings';

export default class KeyvWrapper implements DbConnection {
  private readonly kv: Keyv<any>;

  public constructor(...options: any[]) {
    this.kv = new Keyv(...options);
  }

  public async create(key: string, value: any, ttl?: number): Promise<void> {
    await this.kv.set(key, value, ttl);
  }

  public async read(key: string): Promise<any> {
    return await this.kv.get(key);
  }

  public async update(key: string, value: any, ttl?: number): Promise<void> {
    await this.kv.set(key, value, ttl);
  }

  public async delete(key: string): Promise<void> {
    await this.kv.delete(key);
  }

  public async drop(): Promise<void> {
    await this.kv.clear();
  }
}
