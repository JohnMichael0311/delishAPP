import { cache } from '../utils/simpleCache.js';

export class CacheMonitor {
    constructor() {
        this.metrics = {
            totalRequests: 0,
            hits: 0,
            misses: 0,
            hitRatio: 0,
            lastUpdated: new Date().toISOString()
        };

        try {
            this.setupMetricsTracking();
        } catch (error) {
            console.error('Failed to setup cache monitoring:', error);
        }
    }

    async setupMetricsTracking() {
        try {
            // Track cache hits and misses
            const originalGet = cache.get;
            cache.get = async (...args) => {
                try {
                    this.metrics.totalRequests++;
                    const result = await originalGet(...args);
                    if (result) {
                        this.metrics.hits++;
                    } else {
                        this.metrics.misses++;
                    }
                    this.metrics.hitRatio = this.metrics.totalRequests > 0 
                        ? (this.metrics.hits / this.metrics.totalRequests) * 100
                        : 0;
                    this.metrics.lastUpdated = new Date().toISOString();
                    return result;
                } catch (error) {
                    console.error('Error in cache monitoring:', error);
                    return null;
                }
            };

            // Cleanup function to restore original get method
            this.cleanup = () => {
                cache.get = originalGet;
            };
        } catch (error) {
            console.error('Error setting up cache monitoring:', error);
            throw error;
        }
    }

    async getCacheStats() {
        try {
            return {
                ...this.metrics,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error getting cache stats:', error);
            return {
                error: 'Failed to get cache stats'
            };
        }
    }

    // Cleanup method for proper resource management
    cleanup() {
        if (this.cleanup) {
            this.cleanup();
        }
    }
}
