// import { createClient } from 'redis';
// // import { CACHE_TTL } from '../config/redis.config.js';

// export const CACHE_TTL = 60 * 60; // or whatever value you need
// // Create Redis client
// const client = createClient({
//     url: process.env.REDIS_URL || 'redis://localhost:6379'
// });

// // Basic cache operations
// export const cache = {
//     // Get data from cache
//     async get(key) {
//         try {
//             const data = await client.get(key);
//             return data ? JSON.parse(data) : null;
//         } catch (error) {
//             console.error('Redis get error:', error);
//             return null;
//         }
//     },

//     // Set data to cache with TTL
//     async set(key, value, ttl) {
//         try {
//             const effectiveTtl = ttl || CACHE_TTL.FOODS;
//             await client.setEx(key, effectiveTtl, JSON.stringify(value));
//             return true;
//         } catch (error) {
//             console.error('Redis set error:', error);
//             return false;
//         }
//     },

//     // Delete data from cache
//     async delete(key) {
//         try {
//             return await client.del(key);
//         } catch (error) {
//             console.error('Redis delete error:', error);
//             return false;
//         }
//     }
// };

// import { createClient } from 'redis';

// export const CACHE_TTL = { FOODS: 60 * 60 }; // Set the TTL for cache (1 hour)

// const client = createClient({
//     url: process.env.REDIS_URL || 'redis://localhost:6379'
// });

// // Connect to Redis
// client.connect().catch((err) => {
//     console.error('Redis connection error:', err);
// });

// // Basic cache operations
// export const cache = {
//     // Get data from cache
//     async get(key) {
//         try {
//             if (!client.isOpen) {
//                 console.error('Redis client is closed.');
//                 return null;
//             }
//             const data = await client.get(key);
//             return data ? JSON.parse(data) : null;
//         } catch (error) {
//             console.error('Redis get error:', error);
//             return null;
//         }
//     },

//     // Set data to cache with TTL
//     async set(key, value, ttl) {
//         try {
//             if (value === undefined) {
//                 console.error('Attempted to set undefined value for key:', key);
//                 return false;
//             }

//             const effectiveTtl = ttl || CACHE_TTL.FOODS;

//             // Make sure the client is connected before setting data
//             if (!client.isOpen) {
//                 console.error('Redis client is closed.');
//                 return false;
//             }

//             await client.setEx(key, effectiveTtl, JSON.stringify(value));
//             return true;
//         } catch (error) {
//             console.error('Redis set error:', error);
//             return false;
//         }
//     },

//     // Delete data from cache
//     async delete(key) {
//         try {
//             if (!client.isOpen) {
//                 console.error('Redis client is closed.');
//                 return false;
//             }
//             return await client.del(key);
//         } catch (error) {
//             console.error('Redis delete error:', error);
//             return false;
//         }
//     }
// };// src/utils/simpleCache.js
// import { createClient } from 'redis';

// // Add this in your simpleCache.js
// export const CACHE_TTL = {
//     FOODS: 60 * 60,         // 1 hour for food listings
//     TAGS: 30 * 60,          // 30 mins for tags
//     SEARCH: 15 * 60,        // 15 mins for search results
//     FOOD_DETAIL: 60 * 60,   // 1 hour for individual food item
//   };
  

// const client = createClient({
//   url: process.env.REDIS_URL || 'redis://localhost:6379',
// });

// // Connect to Redis
// client.connect().catch((err) => {
//   console.error('Redis connection error:', err);
// });

// export const cache = {
//   // Get data from Redis
//   async get(key) {
//     try {
//       if (typeof key !== 'string') throw new Error(`Invalid key type for Redis GET: ${key}`);
//       const data = await client.get(key);
//       return data ? JSON.parse(data) : null;
//     } catch (error) {
//       console.error('Redis get error:', error);
//       return null;
//     }
//   },

//   // Set data to Redis with TTL
//   async set(key, value, ttl) {
//     try {
//       if (typeof key !== 'string') throw new Error(`Invalid key type for Redis SET: ${key}`);
//       if (typeof ttl !== 'number' || ttl <= 0) throw new Error(`Invalid TTL for Redis SET: ${ttl}`);
//       if (value === undefined) throw new Error(`Value for Redis SET is undefined (key=${key})`);
//       await client.setEx(key, ttl, JSON.stringify(value));
//       return true;
//     } catch (error) {
//       console.error('Redis set error:', error);
//       return false;
//     }
//   },

//   // Delete key from Redis
//   async delete(key) {
//     try {
//       if (typeof key !== 'string') throw new Error(`Invalid key type for Redis DELETE: ${key}`);
//       return await client.del(key);
//     } catch (error) {
//       console.error('Redis delete error:', error);
//       return false;
//     }
//   },
// };


// import { createClient } from 'redis';

// // export const CACHE_TTL = {
// //   FOODS: 60 * 60,         // 1 hour for food listings
// //   TAGS: 30 * 60,          // 30 mins for tags
// //   SEARCH: 15 * 60,        // 15 mins for search results
// //   FOOD_DETAIL: 60 * 60,   // 1 hour for individual food item
// // };
// // export const CACHE_TTL = {
// //     FOODS: 60 * 60,         // 1 hour
// //     TAGS: 30 * 60,          // 30 minutes
// //     SEARCH: 15 * 60,        // 15 minutes
// //     FOOD_DETAIL: 60 * 60,   // 1 hour
// //     USER: 60 * 60,          // ✅ Add this: 1 hour for user data
// //   };

// export const CACHE_TTL = {
//   FOODS: 60 * 60,
//   TAGS: 30 * 60,
//   SEARCH: 15 * 60,
//   FOOD_DETAIL: 60 * 60,
//   USER: 60 * 60,
//   ORDER: 30 * 60  // ✅ Add this if you're caching orders
// };

  

// const client = createClient({
//   url: process.env.REDIS_URL || 'redis://localhost:6379',
// });

// client.connect().catch((err) => {
//   console.error('Redis connection error:', err);
// });

// const metrics = {
//   totalRequests: 0,
//   hits: 0,
//   misses: 0,
//   lastUpdated: null,
//   get hitRatio() {
//     return this.totalRequests === 0 ? 0 : this.hits / this.totalRequests;
//   }
// };

// export const cache = {
//   metrics,
//   client,

//   async get(key) {
//     try {
//       if (typeof key !== 'string') throw new Error(`Invalid key type for Redis GET: ${key}`);
//       metrics.totalRequests++;
//       const data = await client.get(key);
//       if (data) {
//         metrics.hits++;
//         metrics.lastUpdated = new Date();
//         return JSON.parse(data);
//       } else {
//         metrics.misses++;
//         metrics.lastUpdated = new Date();
//         return null;
//       }
//     } catch (error) {
//       console.error('Redis get error:', error);
//       return null;
//     }
//   },

//   async set(key, value, ttl) {
//     try {
//       if (typeof key !== 'string') throw new Error(`Invalid key type for Redis SET: ${key}`);
//       if (typeof ttl !== 'number' || ttl <= 0) throw new Error(`Invalid TTL for Redis SET: ${ttl}`);
//       if (value === undefined) throw new Error(`Value for Redis SET is undefined (key=${key})`);
//       await client.setEx(key, ttl, JSON.stringify(value));
//       return true;
//     } catch (error) {
//       console.error('Redis set error:', error);
//       return false;
//     }
//   },

//   async delete(key) {
//     try {
//       if (typeof key !== 'string') throw new Error(`Invalid key type for Redis DELETE: ${key}`);
//       return await client.del(key);
//     } catch (error) {
//       console.error('Redis delete error:', error);
//       return false;
//     }
//   },
// };



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
const client = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: process.env.REDIS_URL?.startsWith('rediss://'), // TLS only if using rediss://
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


