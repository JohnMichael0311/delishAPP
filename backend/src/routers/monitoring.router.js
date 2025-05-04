// import { Router } from 'express';
// import handler from 'express-async-handler';
// import admin from '../middleware/admin.mid.js';

// const router = Router();

// // Cache statistics endpoint
// router.get(
//     '/stats',
//     admin,
//     handler(async (req, res) => {
//         res.json({ message: 'Cache monitoring endpoint' });
//     })
// );

// // Cache usage patterns endpoint
// router.get(
//     '/usage',
//     admin,
//     handler(async (req, res) => {
//         res.json({ message: 'Cache usage endpoint' });
//     })
// );

// // Cache health endpoint
// router.get(
//     '/health',
//     admin,
//     handler(async (req, res) => {
//         res.json({ message: 'Cache health endpoint' });
//     })
// );

// // Clear specific cache
// router.delete(
//     '/clear/:key',
//     admin,
//     handler(async (req, res) => {
//         res.json({ message: 'Cache clearing endpoint' });
//     })
// );

// // Clear all cache
// router.delete(
//     '/clear',
//     admin,
//     handler(async (req, res) => {
//         res.json({ message: 'Cache clearing endpoint' });
//     })
// );

// export default router;

import { Router } from 'express';
import handler from 'express-async-handler';
import admin from '../middleware/admin.mid.js';
import { cache } from '../utils/simpleCache.js'; // Assuming this is your Redis cache utility

const router = Router();

// Cache statistics endpoint
router.get(
    '/stats',
    admin,
    handler(async (req, res) => {
        try {
            // Example: Returning basic statistics
            const stats = await cache.get('stats'); // Fetch stats from cache (if any)
            res.json({ message: 'Cache monitoring endpoint', stats });
        } catch (error) {
            console.error('Error getting cache stats:', error);
            res.status(500).json({ message: 'Error getting cache stats' });
        }
    })
);

// Cache usage patterns endpoint
router.get(
    '/usage',
    admin,
    handler(async (req, res) => {
        try {
            // Example: Log or fetch cache usage patterns (hits, misses)
            // This could involve querying Redis for keys or other patterns if tracked in your cache system.
            const usage = await cache.get('usage'); // If you've implemented usage tracking
            res.json({ message: 'Cache usage endpoint', usage });
        } catch (error) {
            console.error('Error fetching cache usage:', error);
            res.status(500).json({ message: 'Error fetching cache usage' });
        }
    })
);

// Cache health endpoint
router.get(
    '/health',
    admin,
    handler(async (req, res) => {
        try {
            // Check if Redis is working correctly
            const health = await cache.get('health'); // Example health check using Redis
            res.json({ message: 'Cache health endpoint', health });
        } catch (error) {
            console.error('Error checking cache health:', error);
            res.status(500).json({ message: 'Cache health check failed' });
        }
    })
);

// Clear specific cache
router.delete(
    '/clear/:key',
    admin,
    handler(async (req, res) => {
        const { key } = req.params;
        try {
            const deleted = await cache.delete(key);
            if (deleted) {
                res.json({ message: `Cache for key ${key} cleared successfully` });
            } else {
                res.status(404).json({ message: `Cache for key ${key} not found` });
            }
        } catch (error) {
            console.error(`Error clearing cache for key ${key}:`, error);
            res.status(500).json({ message: `Error clearing cache for key ${key}` });
        }
    })
);

// Clear all cache
router.delete(
    '/clear',
    admin,
    handler(async (req, res) => {
        try {
            // Assuming you have a method to clear all cache, e.g., `clearAll`
            await cache.delete('all');
            res.json({ message: 'All cache cleared successfully' });
        } catch (error) {
            console.error('Error clearing all cache:', error);
            res.status(500).json({ message: 'Error clearing all cache' });
        }
    })
);

export default router;
