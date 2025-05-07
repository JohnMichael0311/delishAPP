import { createClient } from 'redis';

export const CACHE_TTL = {
  FOODS: 60 * 60,
  TAGS: 30 * 60,
  SEARCH: 15 * 60,
  FOOD_DETAIL: 60 * 60,
  USER: 60 * 60,
  ORDER: 30 * 60,
};

// ✅ Proper Redis client creation with Upstash TLS compatibility
// const client = createClient({
//   url: process.env.REDIS_URL,
//   socket: {
//     tls: process.env.REDIS_URL?.startsWith('rediss://'), // TLS only if using rediss://
//   },
// });
const client = createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  socket: {
    tls: process.env.REDIS_URL?.startsWith('rediss://'),
  },
});


// ✅ Don't auto-connect here; instead export client and let tests/app control it
const metrics = {
  totalRequests: 0,
  hits: 0,
  misses: 0,
  lastUpdated: null,
  get hitRatio() {
    return this.totalRequests === 0 ? 0 : this.hits / this.totalRequests;
  }
};

export const cache = {
  metrics,
  client,

  async get(key) {
    try {
      if (typeof key !== 'string') throw new Error(`Invalid key type for Redis GET: ${key}`);
      metrics.totalRequests++;
      const data = await client.get(key);
      if (data) {
        metrics.hits++;
        metrics.lastUpdated = new Date();
        return JSON.parse(data);
      } else {
        metrics.misses++;
        metrics.lastUpdated = new Date();
        return null;
      }
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  },

  async set(key, value, ttl) {
    try {
      if (typeof key !== 'string') throw new Error(`Invalid key type for Redis SET: ${key}`);
      if (typeof ttl !== 'number' || ttl <= 0) throw new Error(`Invalid TTL for Redis SET: ${ttl}`);
      if (value === undefined) throw new Error(`Value for Redis SET is undefined (key=${key})`);
      await client.setEx(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Redis set error:', error);
      return false;
    }
  },

  async delete(key) {
    try {
      if (typeof key !== 'string') throw new Error(`Invalid key type for Redis DELETE: ${key}`);
      return await client.del(key);
    } catch (error) {
      console.error('Redis delete error:', error);
      return false;
    }
  },
};

// ✅ Export client explicitly so test setup can await .connect()
export { client };


