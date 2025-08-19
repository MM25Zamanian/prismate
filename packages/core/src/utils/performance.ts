// Performance-related utilities

/**
 * Memoize a pure function using a WeakMap for object args and Map for primitives
 */
export const memoize = <TArgs extends readonly unknown[], TResult>(
	fn: (...args: TArgs) => TResult
): ((...args: TArgs) => TResult) => {
	const primitiveCache = new Map<string, TResult>();
	const objectCache = new WeakMap<object, Map<string, TResult>>();

	const getKey = (args: readonly unknown[]): string => {
		return args
			.map((arg) => {
				const type = typeof arg;
				if (arg === null) return 'null';
				if (type === 'object' || type === 'function') return 'obj';
				return `${type}:${String(arg)}`;
			})
			.join('|');
	};

	return (...args: TArgs) => {
		// Fast path: all primitives
		if (args.every((a) => a === null || (typeof a !== 'object' && typeof a !== 'function'))) {
			const key = getKey(args);
			if (primitiveCache.has(key)) return primitiveCache.get(key)!;
			const result = fn(...args);
			primitiveCache.set(key, result);
			return result;
		}

		// Object-based caching: use first object argument as root for WeakMap
		const firstObject = args.find((a) => a && (typeof a === 'object' || typeof a === 'function')) as object | undefined;
		if (!firstObject) {
			return fn(...args);
		}
		let inner = objectCache.get(firstObject);
		if (!inner) {
			inner = new Map<string, TResult>();
			objectCache.set(firstObject, inner);
		}
		const key = getKey(args);
		if (inner.has(key)) return inner.get(key)!;
		const result = fn(...args);
		inner.set(key, result);
		return result;
	};
};

/**
 * Measure execution time of a function and return result with duration in ms
 */
export const timed = <TArgs extends readonly unknown[], TResult>(
	fn: (...args: TArgs) => TResult
): ((...args: TArgs) => { result: TResult; durationMs: number }) => {
	return (...args: TArgs) => {
		const start = performance.now();
		const result = fn(...args);
		const end = performance.now();
		return { result, durationMs: end - start };
	};
};

/**
 * Debounce using microtasks; calls merged once per tick
 */
export const microtaskDebounce = <TArgs extends readonly unknown[]>(
	fn: (...args: TArgs) => void
): ((...args: TArgs) => void) => {
	let scheduled = false;
	let lastArgs: TArgs | null = null;
	return (...args: TArgs) => {
		lastArgs = args;
		if (!scheduled) {
			scheduled = true;
			queueMicrotask(() => {
				scheduled = false;
				if (lastArgs) fn(...lastArgs);
				lastArgs = null as unknown as TArgs;
			});
		}
	};
};