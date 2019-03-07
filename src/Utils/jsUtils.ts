import { Collection } from 'discord.js';

export class JsUtils {
	constructor() {
		throw new Error('This class may not be instantiated!');
	}
	/**
	*		Returns a random element from array 
	*/
	static arrRandom(arr: any[]): any[] {
		return arr[Math.floor(Math.random() * this.length)];
	}

	/** 
	*		Removes elements from an array.
	*		Returns the modified array.
	*		EXAMPLE:
	*		const arr = ['apples', 'oranges', 'bananas', 'cabbage', 'carrots'];
	*		arrErase(arr, 'cabbage', 'carrots');
	*		RETURNS: ['apples', 'oranges', 'bananas']
	*/
	static arrErase(arr: any[], ...args: any[]): any[] {
		for (const arg of args) {
			if (arr.includes(arg)) {
				const index = arr.indexOf(arg);
				arr.splice(index, 1);
			}
		}
		return arr;
	}

	/** 
	* 	Add elements to original array if they don't already exist,
	* 	otherwise push them to the original array.
	* 	Returns the modified array.
	* 	EXAMPLE:
	* 	const arr1 = [1,2,3,4,5,6,7];
	* 	const arr2 = [5,6,7,8,9,10];
	*		console.log( arrToggle(arr1, arr2) );
	* 	Logs: [1,2,3,4,8,9,10]
	*/
	static arrToggle(original: any[], toggleArr: any[]): any[] {
		for (const el of toggleArr) {
			if (!original.includes(el)) {
				original.push(el);
			}
			else {
				const index = original.indexOf(el);
				original.splice(index, 1);
			}
		}
		return original;
	}

	/**
	*		Takes an object and returns a
	*		discord.js Collection from it. 
	*/
	static objToMap(obj: any): Collection<any, any> {
		const keys = Reflect.ownKeys(obj);
		const map = new Collection();
		for (const key of keys) {
			map.set(key, obj[key]);
		}
		return map;
	}

	/**
	*		Takes a map or collection, 
	*		and returns a JS object from it.
	*/
	static mapToObj(map: Map<any, any>): object {
		const obj: any = {};
		for (const [key, val] of map) {
			obj[key] = val;
		}
		return obj;
	}

	/**	
	*		Returns whether object is an instance of a class.
	*		Avoids errors like 
	*		1 instanceof Number // False
	*		'string' instanceof String // False 
	*/
	static isInstance(obj: Object, cls: any): boolean {
		if (obj instanceof cls) return true;
		if (obj.constructor === cls) return true;
		return false;
	}
}
