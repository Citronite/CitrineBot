import { Collection } from 'discord.js';

/**
 * Some extra JS-related utility functions.
 */
export class JsUtils {
  constructor() {
    throw new Error('This class may not be instantiated with the new keyword!');
  }

  public static cloneData(obj: object): object {
    return JSON.parse(JSON.stringify(obj));
  }

  public static arrRandom(arr: any[]): any[] {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  public static objRandom(obj: any[]): any[] {
    const vals = Object.values(obj);
    return vals[Math.floor(Math.random() * vals.length)];
  }

  public static arrErase(arr: any[], ...args: any[]): any[] {
    for (const arg of args) {
      if (arr.includes(arg)) {
        const index = arr.indexOf(arg);
        arr.splice(index, 1);
      }
    }
    return arr;
  }

  public static arrToggle(original: any[], toggleArr: any[]): any[] {
    for (const el of toggleArr) {
      if (!original.includes(el)) {
        original.push(el);
      }	else {
        const index = original.indexOf(el);
        original.splice(index, 1);
      }
    }
    return original;
  }

  public static objToMap(obj: any): Collection<any, any> {
    const keys = Reflect.ownKeys(obj);
    const map = new Collection();
    for (const key of keys) {
      map.set(key, obj[key]);
    }
    return map;
  }

  public static mapToObj(map: Map<any, any> | Collection<any, any>): object {
    const obj: any = {};
    for (const [key, val] of map) {
      obj[key] = val;
    }
    return obj;
  }

  public static isInstance(obj: object, cls: any): boolean {
    if (obj instanceof cls) return true;
    if (obj.constructor === cls) return true;
    return false;
  }
}
