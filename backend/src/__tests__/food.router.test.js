const request = require('supertest');
const express = require('express');
const handler = require('express-async-handler');
const { FoodModel } = require('../models/food.model.js');
jest.mock('../middleware/admin.mid.js', () => [
  (req, res, next) => {
    req.user = { type: 'admin' };
    next();
  },
  (req, res, next) => {
    if (req.user.type === 'admin' || req.user.type === 'restaurant') {
      return next();
    }
    res.status(401).send('You cannot access this page');
  }
]);
const admin = require('../middleware/admin.mid.js');
const { cache, CACHE_TTL } = require('../utils/simpleCache.js');
const foodRouter = require('../routers/food.router.js').default || require('../routers/food.router.js');

jest.mock('../models/food.model.js');
jest.mock('../utils/simpleCache.js', () => {
  return {
    cache: {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      client: { connect: jest.fn(), quit: jest.fn() },
    },
    CACHE_TTL: { FOODS: 3600, TAGS: 3600, SEARCH: 3600, FOOD_DETAIL: 3600 }
  };
});

function mockAdmin(req, res, next) {
  req.user = { type: 'admin' };
  next();
}
function mockNonAdmin(req, res, next) {
  req.user = { type: 'user' };
  next();
}

describe('Food Router', () => {
  let app;
  beforeEach(() => {
    app = express();
    app.use(express.json());
    // By default, allow admin
    app.use('/', foodRouter);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe('GET /', () => {
    it('returns all foods from DB if not cached', async () => {
      cache.get.mockResolvedValue(null);
      const mockFoods = [{ _id: '1', name: 'Pizza' }];
      FoodModel.find.mockResolvedValue(mockFoods);
      cache.set.mockResolvedValue();
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockFoods);
      expect(cache.set).toHaveBeenCalledWith('foods:all', mockFoods, CACHE_TTL.FOODS);
    });
    it('returns foods from cache if present', async () => {
      const mockFoods = [{ _id: '1', name: 'Pizza' }];
      cache.get.mockResolvedValue(mockFoods);
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockFoods);
    });
  });

  describe('POST /', () => {
    it('allows admin to create food', async () => {
      const food = { name: 'Burger', price: 10, tags: 'Fast', favorite: false, imageUrl: '', origins: 'USA', cookTime: 5 };
      FoodModel.mockImplementation(() => ({ save: jest.fn().mockResolvedValue(food) }));
      cache.delete.mockResolvedValue();
      const res = await request(app).post('/').set('access_token', 'admin-token').send(food);
      expect(res.statusCode).toBe(200);
      expect(cache.delete).toHaveBeenCalledWith('foods:all');
    });

  });

  describe('PUT /:foodId', () => {
    it('allows admin to update food', async () => {
      const updated = { _id: '1', name: 'Updated' };
      FoodModel.findByIdAndUpdate.mockResolvedValue(updated);
      cache.delete.mockResolvedValue();
      const res = await request(app).put('/1').set('access_token', 'admin-token').send({ name: 'Updated' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(updated);
      expect(cache.delete).toHaveBeenCalledWith('foods:all');
      expect(cache.delete).toHaveBeenCalledWith('food:1');
    });

  });

  describe('DELETE /:foodId', () => {
    it('allows admin to delete food', async () => {
      FoodModel.findByIdAndDelete.mockResolvedValue({});
      cache.delete.mockResolvedValue();
      const res = await request(app).delete('/1').set('access_token', 'admin-token');
      expect(res.statusCode).toBe(200);
      expect(cache.delete).toHaveBeenCalledWith('foods:all');
      expect(cache.delete).toHaveBeenCalledWith('food:1');
    });

  });

  describe('GET /tags', () => {
    it('returns tags from cache if present', async () => {
      const tags = [{ name: 'All', count: 2 }];
      cache.get.mockResolvedValue(tags);
      const res = await request(app).get('/tags');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(tags);
    });

  });

  describe('GET /search/:searchTerm', () => {
    it('returns foods from cache if present', async () => {
      const foods = [{ _id: '1', name: 'Pizza' }];
      cache.get.mockResolvedValue(foods);
      const res = await request(app).get('/search/pizza');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(foods);
    });
    it('fetches foods from DB and caches if not present', async () => {
      cache.get.mockResolvedValue(null);
      const foods = [{ _id: '1', name: 'Pizza' }];
      FoodModel.find.mockResolvedValue(foods);
      cache.set.mockResolvedValue();
      const res = await request(app).get('/search/pizza');
      expect(res.statusCode).toBe(200);
      expect(cache.set).toHaveBeenCalled();
    });
  });

  describe('GET /tag/:tag', () => {
    it('returns foods from cache if present', async () => {
      const foods = [{ _id: '1', name: 'Pizza' }];
      cache.get.mockResolvedValue(foods);
      const res = await request(app).get('/tag/Fast');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(foods);
    });
    it('fetches foods from DB and caches if not present', async () => {
      cache.get.mockResolvedValue(null);
      const foods = [{ _id: '1', name: 'Pizza' }];
      FoodModel.find.mockResolvedValue(foods);
      cache.set.mockResolvedValue();
      const res = await request(app).get('/tag/Fast');
      expect(res.statusCode).toBe(200);
      expect(cache.set).toHaveBeenCalled();
    });
  });

  describe('GET /:foodId', () => {
    it('returns food from cache if present', async () => {
      const food = { _id: '1', name: 'Pizza' };
      cache.get.mockResolvedValue(food);
      const res = await request(app).get('/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(food);
    });
    it('fetches food from DB and caches if not present', async () => {
      cache.get.mockResolvedValue(null);
      const food = { _id: '1', name: 'Pizza' };
      FoodModel.findById.mockResolvedValue(food);
      cache.set.mockResolvedValue();
      const res = await request(app).get('/1');
      expect(res.statusCode).toBe(200);
      expect(cache.set).toHaveBeenCalled();
    });
  });
});
