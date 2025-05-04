// import { Router } from 'express';
// import { FoodModel } from '../models/food.model.js';
// import handler from 'express-async-handler';
// import admin from '../middleware/admin.mid.js';
// import { cache, CACHE_TTL } from '../utils/simpleCache.js';

// const router = Router();

// router.get(
//   '/',
//   handler(async (req, res) => {
//     const cacheKey = 'foods:all';
//     const cachedFoods = await cache.get(cacheKey);
    
//     if (cachedFoods) {
//       console.log('cache hit'); // <- move above
//       return res.json(cachedFoods);
//     }
    

//     const foods = await FoodModel.find({});
//     await cache.set(cacheKey, foods, CACHE_TTL.FOODS);
    
//     // Cache individual food items
//     for (const food of foods) {
//       await cache.set(`food:${food._id}`, food, CACHE_TTL.FOODS);
//     }
    
//     res.json(foods);
//   })
// );

// router.post(
//   '/',
//   admin,
//   handler(async (req, res) => {
//     const { name, price, tags, favorite, imageUrl, origins, cookTime } =
//       req.body;

//     const food = new FoodModel({
//       name,
//       price,
//       tags: tags.split ? tags.split(',') : tags,
//       favorite,
//       imageUrl,
//       origins: origins.split ? origins.split(',') : origins,
//       cookTime,
//     });

//     await food.save();
//     await cache.delete('foods:all');
//     res.send(food);
//   })
// );

// router.put(
//   '/:foodId',
//   admin,
//   handler(async (req, res) => {
//     const { foodId } = req.params;
    
//     // Update food in MongoDB
//     const food = await FoodModel.findByIdAndUpdate(
//       foodId,
//       { $set: req.body },
//       { new: true }
//     );

//     // Invalidate related caches
//     await cache.delete('foods:all');
//     await cache.delete(`food:${foodId}`);

//     res.send(food);
//   })
// );

// router.delete(
//   '/:foodId',
//   admin,
//   handler(async (req, res) => {
//     const { foodId } = req.params;
    
//     await FoodModel.findByIdAndDelete(foodId);
//     await cache.delete('foods:all');
//     await cache.delete(`food:${foodId}`);

//     res.send();
//   })
// );

// router.get(
//   '/tags',
//   handler(async (req, res) => {
//     const cacheKey = 'foods:tags';
//     const cachedFoods = await cache.get(cacheKey);
    
//     if (cachedFoods) {
//       return res.json(cachedFoods);
//     }

//     const tags = await FoodModel.aggregate([
//       {
//         $unwind: '$tags',
//       },
//       {
//         $group: {
//           _id: '$tags',
//           count: { $sum: 1 },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           name: '$_id',
//           count: '$count',
//         },
//       },
//     ]).sort({ count: -1 });

//     const all = {
//       name: 'All',
//       count: await FoodModel.countDocuments(),
//     };

//     tags.unshift(all);

//     // Cache the result
//     await cache.set(cacheKey, tags, CACHE_TTL.TAGS);
    
//     res.json(tags);
//   })
// );

// router.get(
//   '/search/:searchTerm',
//   handler(async (req, res) => {
//     const { searchTerm } = req.params;
//     const cacheKey = `search:${searchTerm}`;
//     const cachedFoods = await cache.get(cacheKey);
    
//     if (cachedFoods) {
//       return res.json(cachedFoods);
//     }

//     const foods = await FoodModel.find({
//       $or: [
//         { name: { $regex: searchTerm, $options: 'i' } },
//         { tags: { $regex: searchTerm, $options: 'i' } }
//       ]
//     });

//     // Cache the result
//     await cache.set(cacheKey, foods, CACHE_TTL.SEARCH);
    
//     res.json(foods);
//   })
// );

// router.get(
//   '/tag/:tag',
//   handler(async (req, res) => {
//     const { tag } = req.params;
//     const cacheKey = `foods:tag:${tag}`;
//     const cachedFoods = await cache.get(cacheKey);
    
//     if (cachedFoods) {
//       return res.json(cachedFoods);
//     }

//     const foods = await FoodModel.find({ tags: tag });

//     // Cache the results
//     if (foods && foods.length > 0) {
//       await cache.set(cacheKey, foods, CACHE_TTL.FOODS);
//     }

//     res.send(foods);
//   })
// );

// router.get(
//   '/:foodId',
//   handler(async (req, res) => {
//     const { foodId } = req.params;

//     const cacheKey = `food:${foodId}`;
//     const cachedFoods = await cache.get(cacheKey);
    
//     if (cachedFoods) {
//       return res.json(cachedFoods);
//     }

//     const food = await FoodModel.findById(foodId);
//     await cache.set(cacheKey, food, CACHE_TTL.FOOD_DETAIL);
//     res.send(food);
//   })
// );

// export default router;


// import { Router } from 'express';
// import { FoodModel } from '../models/food.model.js';
// import handler from 'express-async-handler';
// import admin from '../middleware/admin.mid.js';
// import { cache, CACHE_TTL } from '../utils/simpleCache.js';

// const router = Router();

// // GET all foods
// router.get(
//   '/',
//   handler(async (req, res) => {
//     const cacheKey = 'foods:all';
//     const cachedFoods = await cache.get(cacheKey);

//     if (cachedFoods) {
//       console.log('Cache hit for all foods');
//       return res.json(cachedFoods);
//     }

//     const foods = await FoodModel.find({});
//     await cache.set(cacheKey, foods, CACHE_TTL.FOODS);

//     // Cache individual food items
//     for (const food of foods) {
//       await cache.set(`food:${food._id}`, food, CACHE_TTL.FOODS);
//     }

//     res.json(foods);
//   })
// );

// // POST a new food item
// router.post(
//   '/',
//   admin,
//   handler(async (req, res) => {
//     const { name, price, tags, favorite, imageUrl, origins, cookTime } = req.body;

//     const food = new FoodModel({
//       name,
//       price,
//       tags: tags.split ? tags.split(',') : tags,
//       favorite,
//       imageUrl,
//       origins: origins.split ? origins.split(',') : origins,
//       cookTime,
//     });

//     await food.save();
//     await cache.delete('foods:all'); // Invalidate the cache for all foods
//     res.send(food);
//   })
// );

// // UPDATE a food item by ID
// router.put(
//   '/:foodId',
//   admin,
//   handler(async (req, res) => {
//     const { foodId } = req.params;
//     const food = await FoodModel.findByIdAndUpdate(foodId, { $set: req.body }, { new: true });

//     if (!food) return res.status(404).json({ error: 'Food not found' });

//     // Invalidate related caches
//     await cache.delete('foods:all');
//     await cache.delete(`food:${foodId}`);

//     res.send(food);
//   })
// );

// // DELETE a food item by ID
// router.delete(
//   '/:foodId',
//   admin,
//   handler(async (req, res) => {
//     const { foodId } = req.params;

//     const food = await FoodModel.findByIdAndDelete(foodId);
//     if (!food) return res.status(404).json({ error: 'Food not found' });

//     // Invalidate related caches
//     await cache.delete('foods:all');
//     await cache.delete(`food:${foodId}`);

//     res.send();
//   })
// );

// // GET food tags
// router.get(
//   '/tags',
//   handler(async (req, res) => {
//     const cacheKey = 'foods:tags';
//     const cachedTags = await cache.get(cacheKey);

//     if (cachedTags) {
//       return res.json(cachedTags);
//     }

//     const tags = await FoodModel.aggregate([
//       { $unwind: '$tags' },
//       { $group: { _id: '$tags', count: { $sum: 1 } } },
//       { $project: { _id: 0, name: '$_id', count: '$count' } },
//     ]).sort({ count: -1 });

//     const all = { name: 'All', count: await FoodModel.countDocuments() };
//     tags.unshift(all);

//     // Cache the result
//     await cache.set(cacheKey, tags, CACHE_TTL.TAGS);
//     res.json(tags);
//   })
// );

// // SEARCH foods by term
// router.get(
//   '/search/:searchTerm',
//   handler(async (req, res) => {
//     const { searchTerm } = req.params;
//     const cacheKey = `search:${searchTerm}`;
//     const cachedFoods = await cache.get(cacheKey);

//     if (cachedFoods) {
//       return res.json(cachedFoods);
//     }

//     const foods = await FoodModel.find({
//       $or: [
//         { name: { $regex: searchTerm, $options: 'i' } },
//         { tags: { $regex: searchTerm, $options: 'i' } },
//       ],
//     });

//     // Cache the result
//     await cache.set(cacheKey, foods, CACHE_TTL.SEARCH);
//     res.json(foods);
//   })
// );

// // GET foods by tag
// router.get(
//   '/tag/:tag',
//   handler(async (req, res) => {
//     const { tag } = req.params;
//     const cacheKey = `foods:tag:${tag}`;
//     const cachedFoods = await cache.get(cacheKey);

//     if (cachedFoods) {
//       return res.json(cachedFoods);
//     }

//     const foods = await FoodModel.find({ tags: tag });

//     // Cache the results if there are any foods
//     if (foods && foods.length > 0) {
//       await cache.set(cacheKey, foods, CACHE_TTL.FOODS);
//     }

//     res.json(foods);
//   })
// );

// // GET a single food item by ID
// router.get(
//   '/:foodId',
//   handler(async (req, res) => {
//     const { foodId } = req.params;
//     const cacheKey = `food:${foodId}`;
//     const cachedFood = await cache.get(cacheKey);

//     if (cachedFood) {
//       return res.json(cachedFood);
//     }

//     const food = await FoodModel.findById(foodId);
//     if (!food) return res.status(404).json({ error: 'Food not found' });

//     // Cache the food item
//     await cache.set(cacheKey, food, CACHE_TTL.FOOD_DETAIL);
//     res.json(food);
//   })
// );

// export default router;



import { Router } from 'express';
import { FoodModel } from '../models/food.model.js';
import handler from 'express-async-handler';
import admin from '../middleware/admin.mid.js';
import { cache, CACHE_TTL } from '../utils/simpleCache.js';

const router = Router();

// GET all foods

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all food items
 *     description: Retrieves a list of all available food items.
 *     operationId: getFoods
 *     responses:
 *       '200':
 *         description: A list of food items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Food'
 */

router.get(
  '/',
  handler(async (req, res) => {
    const cacheKey = 'foods:all';
    const cachedFoods = await cache.get(cacheKey);

    if (cachedFoods) {
      console.log(' Cache hit for all foods');
      return res.json(cachedFoods);
    }

    console.log(' Cache miss for all foods');
    const foods = await FoodModel.find({});
    await cache.set(cacheKey, foods, CACHE_TTL.FOODS);
    console.log(' Stored in cache: all foods');

    // Cache individual food items
    for (const food of foods) {
      await cache.set(`food:${food._id}`, food, CACHE_TTL.FOODS);
    }

    res.json(foods);
  })
);

// POST a new food item

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new food item
 *     description: Adds a new food item to the system (admin only).
 *     operationId: createFood
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Food item details to be added
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: float
 *               tags:
 *                 type: string
 *               favorite:
 *                 type: boolean
 *               imageUrl:
 *                 type: string
 *               origins:
 *                 type: string
 *               cookTime:
 *                 type: integer
 *                 description: Time in minutes
 *     responses:
 *       '201':
 *         description: Food item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Food'
 */
router.post(
  '/',
  admin,
  handler(async (req, res) => {
    const { name, price, tags, favorite, imageUrl, origins, cookTime } = req.body;

    const food = new FoodModel({
      name,
      price,
      tags: tags.split ? tags.split(',') : tags,
      favorite,
      imageUrl,
      origins: origins.split ? origins.split(',') : origins,
      cookTime,
    });

    await food.save();
    await cache.delete('foods:all'); // Invalidate the cache for all foods
    res.send(food);
  })
);

// UPDATE a food item by ID
/**
 * @swagger
 * /{foodId}:
 *   put:
 *     summary: Update a food item
 *     description: Updates a specific food item by ID (admin only).
 *     operationId: updateFood
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: foodId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the food item to be updated
 *     requestBody:
 *       description: Updated food item details
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: float
 *               tags:
 *                 type: string
 *               favorite:
 *                 type: boolean
 *               imageUrl:
 *                 type: string
 *               origins:
 *                 type: string
 *               cookTime:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Food item updated successfully
 */

router.put(
  '/:foodId',
  admin,
  handler(async (req, res) => {
    const { foodId } = req.params;
    const food = await FoodModel.findByIdAndUpdate(foodId, { $set: req.body }, { new: true });

    if (!food) return res.status(404).json({ error: 'Food not found' });

    // Invalidate related caches
    await cache.delete('foods:all');
    await cache.delete(`food:${foodId}`);

    res.send(food);
  })
);

// DELETE a food item by ID

/**
 * @swagger
 * /{foodId}:
 *   delete:
 *     summary: Delete a food item
 *     description: Deletes a specific food item by ID (admin only).
 *     operationId: deleteFood
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: foodId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the food item to delete
 *     responses:
 *       '200':
 *         description: Food item deleted successfully
 */
router.delete(
  '/:foodId',
  admin,
  handler(async (req, res) => {
    const { foodId } = req.params;

    const food = await FoodModel.findByIdAndDelete(foodId);
    if (!food) return res.status(404).json({ error: 'Food not found' });

    // Invalidate related caches
    await cache.delete('foods:all');
    await cache.delete(`food:${foodId}`);

    res.send();
  })
);


/**
 * @swagger
 * /tags:
 *   get:
 *     summary: Get all food tags
 *     description: Retrieves a list of all tags and their frequency in the food items.
 *     operationId: getFoodTags
 *     responses:
 *       '200':
 *         description: A list of food tags and their count
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   count:
 *                     type: integer
 */

// GET food tags
router.get(
  '/tags',
  handler(async (req, res) => {
    const cacheKey = 'foods:tags';
    const cachedTags = await cache.get(cacheKey);

    if (cachedTags) {
      console.log(' Cache hit for food tags');
      return res.json(cachedTags);
    }

    console.log(' Cache miss for food tags');
    const tags = await FoodModel.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $project: { _id: 0, name: '$_id', count: '$count' } },
    ]).sort({ count: -1 });

    const all = { name: 'All', count: await FoodModel.countDocuments() };
    tags.unshift(all);

    await cache.set(cacheKey, tags, CACHE_TTL.TAGS);
    console.log(' Stored in cache: food tags');
    res.json(tags);
  })
);



// SEARCH foods by term


/**
 * @swagger
 * /search/{searchTerm}:
 *   get:
 *     summary: Search for food items by name
 *     description: Searches for food items that match the search term in their name.
 *     operationId: searchFoods
 *     parameters:
 *       - in: path
 *         name: searchTerm
 *         required: true
 *         schema:
 *           type: string
 *         description: Term to search for in food names
 *     responses:
 *       '200':
 *         description: A list of matching food items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Food'
 */
router.get(
  '/search/:searchTerm',
  handler(async (req, res) => {
    const { searchTerm } = req.params;
    const cacheKey = `search:${searchTerm}`;
    const cachedFoods = await cache.get(cacheKey);

    if (cachedFoods) {
      console.log(` Cache hit for search term: "${searchTerm}"`);
      return res.json(cachedFoods);
    }

    console.log(` Cache miss for search term: "${searchTerm}"`);
    const foods = await FoodModel.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { tags: { $regex: searchTerm, $options: 'i' } },
      ],
    });

    await cache.set(cacheKey, foods, CACHE_TTL.SEARCH);
    console.log(` Stored in cache: search result for term "${searchTerm}"`);
    res.json(foods);
  })
);

// GET foods by tag
router.get(
  '/tag/:tag',
  handler(async (req, res) => {
    const { tag } = req.params;
    const cacheKey = `foods:tag:${tag}`;
    const cachedFoods = await cache.get(cacheKey);

    if (cachedFoods) {
      console.log(` Cache hit for foods with tag: "${tag}"`);
      return res.json(cachedFoods);
    }

    console.log(` Cache miss for tag: "${tag}"`);
    const foods = await FoodModel.find({ tags: tag });

    if (foods && foods.length > 0) {
      await cache.set(cacheKey, foods, CACHE_TTL.FOODS);
      console.log(` Stored in cache: foods with tag "${tag}"`);
    }

    res.json(foods);
  })
);

// GET a single food item by ID

/**
 * @swagger
 * /{foodId}:
 *   get:
 *     summary: Get a specific food item
 *     description: Retrieves a single food item by its ID.
 *     operationId: getFoodById
 *     parameters:
 *       - in: path
 *         name: foodId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the food item
 *     responses:
 *       '200':
 *         description: The food item details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Food'
 */
router.get(
  '/:foodId',
  handler(async (req, res) => {
    const { foodId } = req.params;
    const cacheKey = `food:${foodId}`;
    const cachedFood = await cache.get(cacheKey);

    if (cachedFood) {
      console.log(` Cache hit for food ID: "${foodId}"`);
      return res.json(cachedFood);
    }

    console.log(` Cache miss for food ID: "${foodId}"`);
    const food = await FoodModel.findById(foodId);
    if (!food) return res.status(404).json({ error: 'Food not found' });

    await cache.set(cacheKey, food, CACHE_TTL.FOOD_DETAIL);
    console.log(` Stored in cache: food ID "${foodId}"`);
    res.json(food);
  })
);

// /**
//  * @swagger
//  * /{foodId}:
//  *   put:
//  *     summary: Update a food item
//  *     description: Updates a specific food item by ID (admin only).
//  *     operationId: updateFood
//  *     security:
//  *       - BearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: foodId
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: ID of the food item to be updated
//  *     requestBody:
//  *       description: Updated food item details
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *               price:
//  *                 type: number
//  *                 format: float
//  *               tags:
//  *                 type: string
//  *               favorite:
//  *                 type: boolean
//  *               imageUrl:
//  *                 type: string
//  *               origins:
//  *                 type: string
//  *               cookTime:
//  *                 type: integer
//  *     responses:
//  *       '200':
//  *         description: Food item updated successfully
//  */
// router.put(
//   '/:foodId',
//   admin,
//   handler(async (req, res) => {
//     const { foodId } = req.params;
//     const { name, price, tags, favorite, imageUrl, origins, cookTime } = req.body;

//     await FoodModel.updateOne(
//       { _id: foodId },
//       { name, price, tags, favorite, imageUrl, origins, cookTime }
//     );

//     res.send();
//   })
// );

export default router;


