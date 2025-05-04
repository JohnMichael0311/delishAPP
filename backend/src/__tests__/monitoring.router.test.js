const request = require('supertest');
const express = require('express');

const monitoringRouter = require('../routers/monitoring.router.js').default || require('../routers/monitoring.router.js');
const { cache } = require('../utils/simpleCache.js');
const admin = require('../middleware/admin.mid.js');

jest.mock('../utils/simpleCache.js', () => ({
  cache: {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    client: { connect: jest.fn(), quit: jest.fn() },
  }
}));
jest.mock('../middleware/admin.mid.js', () => (req, res, next) => {
  req.user = { id: 'admin123', type: 'admin', email: 'admin@example.com' };
  next();
});

describe('Monitoring Router', () => {
  let app;
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/monitoring', monitoringRouter);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.resetAllMocks();
  });

  describe('GET /monitoring/stats', () => {
    it('returns cache stats if available', async () => {
      cache.get.mockResolvedValue({ hits: 10, misses: 2 });
      const res = await request(app).get('/monitoring/stats');
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({ message: 'Cache monitoring endpoint', stats: { hits: 10, misses: 2 } });
    });
    it('handles error getting cache stats', async () => {
      cache.get.mockRejectedValue(new Error('fail'));
      const res = await request(app).get('/monitoring/stats');
      expect(res.statusCode).toBe(500);
      expect(res.body).toMatchObject({ message: 'Error getting cache stats' });
    });
  });

  describe('GET /monitoring/usage', () => {
    it('returns cache usage if available', async () => {
      cache.get.mockResolvedValue({ hits: 20, misses: 5 });
      const res = await request(app).get('/monitoring/usage');
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({ message: 'Cache usage endpoint', usage: { hits: 20, misses: 5 } });
    });
    it('handles error fetching cache usage', async () => {
      cache.get.mockRejectedValue(new Error('fail'));
      const res = await request(app).get('/monitoring/usage');
      expect(res.statusCode).toBe(500);
      expect(res.body).toMatchObject({ message: 'Error fetching cache usage' });
    });
  });

  describe('GET /monitoring/health', () => {
    it('returns cache health if available', async () => {
      cache.get.mockResolvedValue('ok');
      const res = await request(app).get('/monitoring/health');
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({ message: 'Cache health endpoint', health: 'ok' });
    });
    it('handles error fetching cache health', async () => {
      cache.get.mockRejectedValue(new Error('fail'));
      const res = await request(app).get('/monitoring/health');
      expect(res.statusCode).toBe(500);
      expect(res.body).toMatchObject({ message: 'Cache health check failed' });
    });
  });

  describe('DELETE /monitoring/clear/:key', () => {
    it('clears specific cache key', async () => {
      cache.delete.mockResolvedValue(true);
      const res = await request(app).delete('/monitoring/clear/somekey');
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({ message: 'Cache for key somekey cleared successfully' });
    });
    it('returns 404 if cache key not found', async () => {
      cache.delete.mockResolvedValue(false);
      const res = await request(app).delete('/monitoring/clear/somekey');
      expect(res.statusCode).toBe(404);
      expect(res.body).toMatchObject({ message: 'Cache for key somekey not found' });
    });
  });

  describe('DELETE /monitoring/clear', () => {
    it('clears all cache', async () => {
      cache.delete.mockResolvedValue();
      const res = await request(app).delete('/monitoring/clear');
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({ message: 'All cache cleared successfully' });
    });
  });
});
