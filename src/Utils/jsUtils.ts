import { Collection } from 'discord.js';

/**
 * Some extra JS-related utility functions.
 */
export class JsUtils {
	constructor() {
		throw new Error('This class may not be instantiated!');
	}

	/**
	 * Deep clones all JSON-supported properties.
	 * JSON-supported types:
	 * string, number, null, boolean, array, objects (JSON objects)
	 *
	 * @param {object} obj - The object to clone
	 * @returns {object} The cloned object
	 * @example
	 * const obj = { a: 'a', b: 'b', c: 'c', d: () => 'c' };
	 * const copy = cloneData(obj);
	 * console.log(copy); // { a: 'a', b: 'b', c: 'c' }
	 * @static
	 */
	public static cloneData(obj: object): object {
		return JSON.parse(JSON.stringify(obj));
	}

	/**
	 * Returns a random element from an array.
	 *
	 * @param {array} arr
	 * @returns {any}
	 * @static
	 */
	public static arrRandom(arr: any[]): any[] {
		return arr[Math.floor(Math.random() * arr.length)];
	}

	/**
	 * Returns a random value from an object.
	 *
	 * @param {array} obj
	 * @returns {any}
	 * @static
	 */
	public static objRandom(obj: any[]): any[] {
		const vals = Object.values(obj);
		return vals[Math.floor(Math.random() * vals.length)];
	}

	/**
	 * Removes elements from an array.
	 *
	 * @param {array} arr - The array to erase from
	 * @param {...any} args -  Elements to erase
	 * @returns {array} The modified array
	 * @example
	 * const arr = ['apples', 'oranges', 'bananas', 'cabbage', 'carrots'];
	 * arrErase(arr, 'cabbage', 'carrots');
	 * console.log(arr); // ['apples', 'oranges', 'bananas'];
	 * @static
	 */
	public static arrErase(arr: any[], ...args: any[]): any[] {
		for (const arg of args) {
			if (arr.includes(arg)) {
				const index = arr.indexOf(arg);
				arr.splice(index, 1);
			}
		}
		return arr;
	}

	/**
	 * Removes elements from the original array if they already exist, otherwise
	 * adds them to the original one if they don't.
	 *
	 * @param {array} original
	 * @param {array} toggleArr
	 * @returns {array} The final array.
	 * @example
	 * const first = [1,2,3,4,5,6,7];
	 * const second = [5,6,7,8,9,10];
	 * console.log(arrToggle(first, second)); // [1,2,3,4,8,9,10]
	 * @static
	 */
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

	/**
 	* Converts a JS Object to a djs Collection (which extends map, hence the name)
 	*
 	* @param {object} obj - A JS object
 	* @returns {Collection}
 	* @static
 	*/
	public static objToMap(obj: any): Collection<any, any> {
		const keys = Reflect.ownKeys(obj);
		const map = new Collection();
		for (const key of keys) {
			map.set(key, obj[key]);
		}
		return map;
	}

	/**
	 * Converts a Map or Collection to a JS object.
	 *
	 * @param {Map | Collection} map - A map or collection
	 * @returns {object}
	 * @static
	 */
	public static mapToObj(map: Map<any, any> | Collection<any, any>): object {
		const obj: any = {};
		for (const [key, val] of map) {
			obj[key] = val;
		}
		return obj;
	}

	/**
	 * Chcek whether an object is an instance of a class. Avoids errors
	 * with the built-in instanceof operator.
	 *
	 * @param {object} obj - The instance you want to check
	 * @param {class} cls - The class you want to check against
	 * @returns {boolean}
	 * @static
	 */
	public static isInstance(obj: object, cls: any): boolean {
		if (obj instanceof cls) return true;
		if (obj.constructor === cls) return true;
		return false;
	}
}
