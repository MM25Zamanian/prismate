// Caching utilities for performance optimization

/**
 * LRU Cache implementation
 */
export class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private readonly maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      // Update existing key
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }

  keys(): IterableIterator<K> {
    return this.cache.keys();
  }

  values(): IterableIterator<V> {
    return this.cache.values();
  }

  entries(): IterableIterator<[K, V]> {
    return this.cache.entries();
  }
}

/**
 * Time-based cache with TTL (Time To Live)
 */
export class TTLCache<K, V> {
  private cache = new Map<K, { value: V; expiry: number }>();
  private readonly defaultTTL: number;

  constructor(defaultTTL: number = 5 * 60 * 1000) { // 5 minutes default
    this.defaultTTL = defaultTTL;
  }

  get(key: K): V | undefined {
    const item = this.cache.get(key);
    if (!item) return undefined;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value;
  }

  set(key: K, value: V, ttl?: number): void {
    const expiry = Date.now() + (ttl ?? this.defaultTTL);
    this.cache.set(key, { value, expiry });
  }

  has(key: K): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }

  get size(): number {
    this.cleanup();
    return this.cache.size;
  }
}

/**
 * WeakMap-based cache for object keys
 */
export class WeakCache<K extends object, V> {
  private cache = new WeakMap<K, V>();

  get(key: K): V | undefined {
    return this.cache.get(key);
  }

  set(key: K, value: V): void {
    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }
}

/**
 * Cache statistics interface
 */
export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
  maxSize?: number;
}

/**
 * Cache with statistics tracking
 */
export class StatsCache<K, V> {
  private cache: LRUCache<K, V>;
  private hits = 0;
  private misses = 0;

  constructor(maxSize: number = 100) {
    this.cache = new LRUCache<K, V>(maxSize);
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      this.hits++;
    } else {
      this.misses++;
    }
    return value;
  }

  set(key: K, value: V): void {
    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  getStats(): CacheStats {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? this.hits / total : 0,
      size: this.cache.size,
    };
  }

  resetStats(): void {
    this.hits = 0;
    this.misses = 0;
  }
}

/**
 * Multi-level cache with L1 (memory) and L2 (persistent) layers
 */
export class MultiLevelCache<K, V> {
  private l1Cache: LRUCache<K, V>;
  private l2Cache: Map<K, V>;

  constructor(l1Size: number = 50, l2Size: number = 500) {
    this.l1Cache = new LRUCache<K, V>(l1Size);
    this.l2Cache = new Map<K, V>();
  }

  get(key: K): V | undefined {
    // Try L1 cache first
    let value = this.l1Cache.get(key);
    if (value !== undefined) {
      return value;
    }

    // Try L2 cache
    value = this.l2Cache.get(key);
    if (value !== undefined) {
      // Promote to L1
      this.l1Cache.set(key, value);
      return value;
    }

    return undefined;
  }

  set(key: K, value: V): void {
    this.l1Cache.set(key, value);
    this.l2Cache.set(key, value);
  }

  has(key: K): boolean {
    return this.l1Cache.has(key) || this.l2Cache.has(key);
  }

  delete(key: K): boolean {
    const l1Deleted = this.l1Cache.delete(key);
    const l2Deleted = this.l2Cache.delete(key);
    return l1Deleted || l2Deleted;
  }

  clear(): void {
    this.l1Cache.clear();
    this.l2Cache.clear();
  }

  get size(): number {
    return this.l2Cache.size;
  }
}

/**
 * Cache factory for creating different types of caches
 */
export class CacheFactory {
  static createLRU<K, V>(maxSize: number = 100): LRUCache<K, V> {
    return new LRUCache<K, V>(maxSize);
  }

  static createTTL<K, V>(defaultTTL: number = 5 * 60 * 1000): TTLCache<K, V> {
    return new TTLCache<K, V>(defaultTTL);
  }

  static createWeak<K extends object, V>(): WeakCache<K, V> {
    return new WeakCache<K, V>();
  }

  static createStats<K, V>(maxSize: number = 100): StatsCache<K, V> {
    return new StatsCache<K, V>(maxSize);
  }

  static createMultiLevel<K, V>(
    l1Size: number = 50,
    l2Size: number = 500
  ): MultiLevelCache<K, V> {
    return new MultiLevelCache<K, V>(l1Size, l2Size);
  }
}