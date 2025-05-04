import { cache } from '../utils/simpleCache.js';
import { CACHE_KEYS, CACHE_TTL } from '../config/redis.config.js';
import { FoodModel } from '../models/food.model.js';
import { UserModel } from '../models/user.model.js';
import { OrderModel } from '../models/order.model.js';

async function preloadCache() {
    try {
        console.log('Starting cache preloading...');

        // Preload foods
        console.log('Preloading foods...');
        const foods = await FoodModel.find({});
        await cache.set(CACHE_KEYS.ALL_FOODS, foods);

        // Preload individual food details
        for (const food of foods) {
            await cache.set(
                CACHE_KEYS.FOOD_DETAIL(food._id),
                food
            );
        }

        // Preload popular users
        console.log('Preloading popular users...');
        const popularUsers = await UserModel.find({ type: 'restaurant' })
            .sort({ rating: -1 })
            .limit(10);
        for (const user of popularUsers) {
            await cache.set(
                CACHE_KEYS.USER_DETAIL(user._id),
                user
            );
        }

        // Preload recent orders
        console.log('Preloading recent orders...');
        const recentOrders = await OrderModel.find({})
            .sort({ createdAt: -1 })
            .limit(50);
        for (const order of recentOrders) {
            await cache.set(
                CACHE_KEYS.ORDER_DETAIL(order._id),
                order
            );
        }

        console.log('Cache preloading completed successfully!');
    } catch (error) {
        console.error('Error preloading cache:', error);
        process.exit(1);
        process.exit(1);
    }
}

// Run the preload function
preloadCache();
