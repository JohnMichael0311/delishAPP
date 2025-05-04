export const REDIS_CONFIG = {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    connectTimeout: 5000,
    maxRetries: parseInt(process.env.REDIS_MAX_RETRIES) || 5,
    keepAlive: parseInt(process.env.REDIS_KEEP_ALIVE) || 30000,
    maxMemory: parseInt(process.env.REDIS_MAX_MEMORY) || 1000000000, // 1GB default
    fallbackToMemory: true
};

// Cache TTL configurations (in seconds)
export const CACHE_TTL = {
    FOODS: parseInt(process.env.REDIS_CACHE_TTL_FOODS) || 3600,          // 1 hour
    FOOD_DETAIL: parseInt(process.env.REDIS_CACHE_TTL_FOOD_DETAIL) || 7200,    // 2 hours
    USER: parseInt(process.env.REDIS_CACHE_TTL_USER) || 1800,          // 30 minutes
    ORDER: parseInt(process.env.REDIS_CACHE_TTL_ORDER) || 900,         // 15 minutes
    SEARCH: parseInt(process.env.REDIS_CACHE_TTL_SEARCH) || 3600,      // 1 hour
    TAG: parseInt(process.env.REDIS_CACHE_TTL_TAG) || 3600            // 1 hour
};

// Cache key patterns
export const CACHE_KEYS = {
    ALL_FOODS: 'foods:all',
    FOOD_DETAIL: (id) => `foods:${id}`,
    USER_DETAIL: (id) => `users:${id}`,
    ORDER_DETAIL: (id) => `orders:${id}`,
    SEARCH_RESULTS: (term) => `search:${term}`,
    TAG_RESULTS: (tag) => `tag:${tag}`
};
