import { deepClone, deepMerge, pick, omit, isEmpty, get, set, flatten } from '../object';

describe('Object Utilities', () => {
  describe('deepClone', () => {
    it('should clone primitive values', () => {
      expect(deepClone(42)).toBe(42);
      expect(deepClone('test')).toBe('test');
      expect(deepClone(true)).toBe(true);
      expect(deepClone(null)).toBe(null);
    });

    it('should clone objects deeply', () => {
      const original = { a: 1, b: { c: 2 } };
      const cloned = deepClone(original);
      
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.b).not.toBe(original.b);
    });

    it('should clone arrays deeply', () => {
      const original = [1, [2, 3], { a: 4 }];
      const cloned = deepClone(original);
      
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[1]).not.toBe(original[1]);
      expect(cloned[2]).not.toBe(original[2]);
    });
  });

  describe('deepMerge', () => {
    it('should merge objects deeply', () => {
      const obj1 = { a: 1, b: { c: 2 } };
      const obj2 = { b: { d: 3 }, e: 4 };
      const result = deepMerge(obj1, obj2 as Record<string, unknown>);
      
      expect(result).toEqual({
        a: 1,
        b: { c: 2, d: 3 },
        e: 4
      });
    });
  });

  describe('pick', () => {
    it('should pick specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = pick(obj, ['a', 'c']);
      
      expect(result).toEqual({ a: 1, c: 3 });
    });
  });

  describe('omit', () => {
    it('should omit specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = omit(obj, ['b']);
      
      expect(result).toEqual({ a: 1, c: 3 });
    });
  });

  describe('isEmpty', () => {
    it('should check if object is empty', () => {
      expect(isEmpty({})).toBe(true);
      expect(isEmpty({ a: 1 })).toBe(false);
    });
  });

  describe('get', () => {
    it('should get nested properties', () => {
      const obj = { a: { b: { c: 1 } } };
      expect(get(obj, 'a.b.c')).toBe(1);
      expect(get(obj, 'a.b.d', 'default')).toBe('default');
    });
  });

  describe('set', () => {
    it('should set nested properties', () => {
      const obj: Record<string, unknown> = {};
      set(obj, 'a.b.c', 1);
      
      expect(get(obj, 'a.b.c')).toBe(1);
    });
  });

  describe('flatten', () => {
    it('should flatten nested objects', () => {
      const obj = { a: 1, b: { c: 2, d: { e: 3 } } };
      const result = flatten(obj);
      
      expect(result).toEqual({
        'a': 1,
        'b.c': 2,
        'b.d.e': 3
      });
    });
  });
});