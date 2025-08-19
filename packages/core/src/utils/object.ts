// Object utility functions

/**
 * Deep clones an object with memoization to handle cycles and improve performance
 */
const cloneCache = new WeakMap<object, unknown>();
export const deepClone = <T>(obj: T): T => {
	if (obj === null || typeof obj !== 'object') return obj as T;

	// Use cache for objects/arrays/dates/maps/sets
	const cached = cloneCache.get(obj as unknown as object);
	if (cached) return cached as T;

	// Dates
	if (obj instanceof Date) {
		const clonedDate = new Date(obj.getTime()) as unknown as T;
		cloneCache.set(obj as unknown as object, clonedDate);
		return clonedDate;
	}

	// Arrays
	if (Array.isArray(obj)) {
		const source = obj as unknown as unknown[];
		const result: unknown[] = new Array(source.length);
		cloneCache.set(obj as unknown as object, result);
		for (let i = 0; i < source.length; i++) {
			result[i] = deepClone(source[i]);
		}
		return result as unknown as T;
	}

	// Map
	if (obj instanceof Map) {
		const result = new Map<unknown, unknown>();
		cloneCache.set(obj as unknown as object, result);
		for (const [key, value] of (obj as unknown as Map<unknown, unknown>).entries()) {
			result.set(deepClone(key), deepClone(value));
		}
		return result as unknown as T;
	}

	// Set
	if (obj instanceof Set) {
		const result = new Set<unknown>();
		cloneCache.set(obj as unknown as object, result);
		for (const value of obj as unknown as Set<unknown>) {
			result.add(deepClone(value));
		}
		return result as unknown as T;
	}

	// Plain objects
	const result: Record<string, unknown> = {};
	cloneCache.set(obj as unknown as object, result);
	for (const key in obj as Record<string, unknown>) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			result[key] = deepClone((obj as Record<string, unknown>)[key]);
		}
	}
	return result as T;
};

/**
 * Merges multiple objects deeply
 */
export const deepMerge = <T extends Record<string, unknown>>(...objects: Partial<T>[]): T => {
	const result = {} as T;

	for (const obj of objects) {
		if (!obj) continue;

		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				const current = (result as Record<string, unknown>)[key];
				const incoming = (obj as Record<string, unknown>)[key];
				if (incoming && typeof incoming === 'object' && !Array.isArray(incoming)) {
					(result as Record<string, unknown>)[key] = deepMerge((current as Record<string, unknown>) || {}, incoming as Record<string, unknown>);
				} else {
					(result as Record<string, unknown>)[key] = incoming;
				}
			}
		}
	}

	return result;
};

/**
 * Picks specific keys from an object
 */
export const pick = <T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> => {
	const result = {} as Pick<T, K>;
	for (const key of keys) {
		if (key in obj) {
			result[key] = obj[key];
		}
	}
	return result;
};

/**
 * Omits specific keys from an object
 */
export const omit = <T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Omit<T, K> => {
	const result = {} as Omit<T, K>;
	const forbidden = new Set<string>(keys.map((k) => String(k)));
	for (const key in obj as Record<string, unknown>) {
		if (!forbidden.has(key)) {
			(result as Record<string, unknown>)[key] = (obj as Record<string, unknown>)[key];
		}
	}
	return result;
};

/**
 * Checks if an object is empty
 */
export const isEmptyObject = (obj: Record<string, unknown>): boolean => {
	return Object.keys(obj).length === 0;
};

/**
 * Gets nested object property safely
 */
export const get = <TExpected = unknown>(obj: unknown, path: string, defaultValue?: TExpected): TExpected | undefined => {
	if (obj == null) return defaultValue;
	const keys = path.split('.');
	let result: unknown = obj;

	for (const segment of keys) {
		if (result && typeof result === 'object' && segment in (result as Record<string, unknown>)) {
			result = (result as Record<string, unknown>)[segment];
		} else {
			return defaultValue;
		}
	}

	return result as TExpected;
};

/**
 * Sets nested object property safely
 */
export const set = (obj: Record<string, unknown>, path: string, value: unknown): void => {
	const keys = path.split('.');
	let current: Record<string, unknown> = obj;

	for (let i = 0; i < keys.length - 1; i++) {
		const segment = keys[i]!;
		if (!(segment in current) || typeof current[segment] !== 'object' || current[segment] === null) {
			current[segment] = {};
		}
		current = current[segment] as Record<string, unknown>;
	}

	current[keys[keys.length - 1]!] = value;
};

/**
 * Flattens a nested object
 */
export const flatten = (obj: Record<string, unknown>, prefix = ''): Record<string, unknown> => {
	const result: Record<string, unknown> = {};

	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const newKey = prefix ? `${prefix}.${key}` : key;

			if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
				Object.assign(result, flatten(obj[key] as Record<string, unknown>, newKey));
			} else {
				result[newKey] = obj[key];
			}
		}
	}

	return result;
}; 