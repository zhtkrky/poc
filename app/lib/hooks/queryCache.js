'use client';

/**
 * Query Cache
 * Global cache for storing query results with automatic cleanup
 */
class QueryCache {
  constructor() {
    this.cache = new Map();
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, entry) {
    // Clear existing timeout if any
    const existing = this.cache.get(key);
    if (existing?.timeoutId) {
      clearTimeout(existing.timeoutId);
    }
    this.cache.set(key, entry);
  }

  delete(key) {
    const entry = this.cache.get(key);
    if (entry?.timeoutId) {
      clearTimeout(entry.timeoutId);
    }
    this.cache.delete(key);
  }

  clear() {
    this.cache.forEach((entry) => {
      if (entry.timeoutId) {
        clearTimeout(entry.timeoutId);
      }
    });
    this.cache.clear();
  }
}

export const queryCache = new QueryCache();
