import { DbConnection } from 'typings';

export default class MapWrapper implements DbConnection {
  private readonly map: Map<string, any>;

  public constructor() {
    this.map = new Map();
  }

  public async create(key: string, value: any): Promise<void> {
    this.map.set(key, value);
  }

  public async read(key: string): Promise<any> {
    return this.map.get(key);
  }

  public async update(key: string, value: any): Promise<void> {
    this.map.set(key, value);
  }

  public async delete(key: string): Promise<void> {
    this.map.delete(key);
  }

  public async drop(): Promise<void> {
    this.map.clear();
  }
}
