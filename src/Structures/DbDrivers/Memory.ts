import MapWrapper from './Utils/MapWrapper';

export default class Memory implements DbDriver {
  [key: string]: any;

  public readonly type: 'Memory';

  public constructor() {
    this.type = 'Memory';
  }

  public connect(name: string): DbConnection {
    try {
      this[name] = new MapWrapper();
      return this[name];
    } catch (err) {
      throw err;
    }
  }

  public disconnect(name: string): void {
    delete this[name];
  }
}
