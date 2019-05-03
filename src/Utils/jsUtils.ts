// Some small js snippets which I thought
// would be useful someday....

function cloneData(obj: object): object {
  return JSON.parse(JSON.stringify(obj));
}

function arrayRandom(arr: any[]): any[] {
  return arr[Math.floor(Math.random() * arr.length)];
}

function objectRandom(obj: any[]): any[] {
  const vals = Object.values(obj);
  return vals[Math.floor(Math.random() * vals.length)];
}

function arrayErase(arr: any[], ...args: any[]): any[] {
  for (const arg of args) {
    if (arr.includes(arg)) {
      const index = arr.indexOf(arg);
      arr.splice(index, 1);
    }
  }
  return arr;
}

function arrayToggle(original: any[], toggleArr: any[]): any[] {
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

function objectToMap(obj: any): Map<any, any> {
  const keys = Reflect.ownKeys(obj);
  const map = new Map();
  for (const key of keys) {
    map.set(key, obj[key]);
  }
  return map;
}

function mapToObject(map: Map<any, any>): object {
  const obj: any = {};
  for (const [key, val] of map) {
    obj[key] = val;
  }
  return obj;
}
