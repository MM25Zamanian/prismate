// Object utility functions

/**
 * Deep clones an object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

/**
 * Merges multiple objects deeply
 */
export const deepMerge = <T extends Record<string, unknown>>(...objects: Partial<T>[]): T => {
  const result = {} as T;
  
  for (const obj of objects) {
    if (obj === null || obj === undefined) continue;
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
          const existingValue = result[key];
          const mergedValue = deepMerge(
            (existingValue && typeof existingValue === 'object' ? existingValue : {}) as Partial<T>,
            value as Partial<T>
          );
          (result as Record<string, unknown>)[key] = mergedValue;
        } else {
          (result as Record<string, unknown>)[key] = value;
        }
      }
    }
  }
  
  return result;
};

/**
 * Picks specific keys from an object
 */
export const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
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
export const omit = <T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = {} as Omit<T, K>;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const typedKey = key as keyof T;
      if (!keys.includes(typedKey as K)) {
        (result as Record<string, unknown>)[key] = obj[typedKey];
      }
    }
  }
  return result;
};

/**
 * Checks if an object is empty
 */
export const isEmpty = (obj: Record<string, unknown>): boolean => {
  return Object.keys(obj).length === 0;
};

/**
 * Gets nested object property safely
 */
export const get = <T>(obj: Record<string, unknown>, path: string, defaultValue?: T): T | undefined => {
  const keys = path.split('.');
  let result: unknown = obj;
  
  for (const key of keys) {
    if (result !== null && typeof result === 'object' && key in (result as Record<string, unknown>)) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return defaultValue;
    }
  }
  
  return result as T;
};

/**
 * Sets nested object property safely
 */
export const set = (obj: Record<string, unknown>, path: string, value: unknown): void => {
  const keys = path.split('.');
  let current: Record<string, unknown> = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!key) continue;
    
    if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  
  const lastKey = keys[keys.length - 1];
  if (lastKey) {
    current[lastKey] = value;
  }
};

/**
 * Flattens a nested object
 */
export const flatten = (obj: Record<string, unknown>, prefix = ''): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        Object.assign(result, flatten(obj[key] as Record<string, unknown>, newKey));
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  
  return result;
}; 