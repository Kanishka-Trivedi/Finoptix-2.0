// Simple in-memory cache with TTL
class Cache {
  constructor() {
    this.store = new Map();
  }

  set(key, value, ttl = 12 * 60 * 60 * 1000) { // Default 12 hours
    const expiry = Date.now() + ttl;
    this.store.set(key, { value, expiry });
  }

  get(key) {
    const item = this.store.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }
    
    return item.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  clear() {
    this.store.clear();
  }
}

export const cache = new Cache();
