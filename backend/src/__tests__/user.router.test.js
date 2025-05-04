const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { UserModel } = require('../models/user.model.js');
const { cache, CACHE_TTL } = require('../utils/simpleCache.js');
const userRouter = require('../routers/user.router.js').default || require('../routers/user.router.js');
const auth = require('../middleware/auth.mid.js');
const admin = require('../middleware/admin.mid.js');
const { BAD_REQUEST } = require('../constants/httpStatus.js');

jest.mock('../models/user.model.js');
jest.mock('../utils/simpleCache.js', () => ({
  cache: {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    client: { connect: jest.fn(), quit: jest.fn() },
  },
  CACHE_TTL: { USER: 3600 }
}));
jest.mock('../middleware/auth.mid.js', () => (req, res, next) => {
  req.user = { id: 'user123', type: 'user', email: 'test@example.com' };
  next();
});
jest.mock('../middleware/admin.mid.js', () => (req, res, next) => {
  req.user = { id: 'admin123', type: 'admin', email: 'admin@example.com' };
  next();
});
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('User Router', () => {
  let app;
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/users', userRouter);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });
  afterAll(() => {
    jest.resetAllMocks();
  });

  describe('POST /api/users/register', () => {
    it('registers a new user', async () => {
      UserModel.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedpw');
      UserModel.create.mockResolvedValue({ _id: 'user123', name: 'Test', email: 'test@example.com', password: 'hashedpw', address: 'Somewhere' });
      cache.set.mockResolvedValue();
      jwt.sign.mockReturnValue('token');
      const res = await request(app).post('/api/users/register').send({ name: 'Test', email: 'test@example.com', password: 'pw', address: 'Somewhere' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({ email: 'test@example.com', token: 'token' });
    });
    it('fails if user already exists', async () => {
      UserModel.findOne.mockResolvedValue({ email: 'test@example.com' });
      const res = await request(app).post('/api/users/register').send({ name: 'Test', email: 'test@example.com', password: 'pw', address: 'Somewhere' });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/users/login', () => {
    it('logs in user with correct credentials', async () => {
      const user = { _id: 'user123', name: 'Test', email: 'test@example.com', password: 'hashedpw', address: 'Somewhere', type: 'user' };
      UserModel.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      cache.delete.mockResolvedValue();
      jwt.sign.mockReturnValue('token');
      const res = await request(app).post('/api/users/login').send({ email: 'test@example.com', password: 'pw' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({ email: 'test@example.com', token: 'token' });
    });
    it('fails with wrong credentials', async () => {
      UserModel.findOne.mockResolvedValue({ email: 'test@example.com', password: 'hashedpw' });
      bcrypt.compare.mockResolvedValue(false);
      const res = await request(app).post('/api/users/login').send({ email: 'test@example.com', password: 'wrong' });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('PUT /api/users/updateProfile', () => {
    it('updates profile and invalidates cache', async () => {
      UserModel.findByIdAndUpdate.mockResolvedValue({ _id: 'user123', name: 'NewName', address: 'NewAddr', email: 'test@example.com', type: 'user' });
      cache.delete.mockResolvedValue();
      jwt.sign.mockReturnValue('token');
      const res = await request(app).put('/api/users/updateProfile').send({ name: 'NewName', address: 'NewAddr' });
      expect(res.statusCode).toBe(200);
      expect(cache.delete).toHaveBeenCalledWith('user:user123');
      expect(res.body).toMatchObject({ name: 'NewName', address: 'NewAddr', token: 'token' });
    });
  });

  describe('PUT /api/users/changePassword', () => {
    it('changes password if current is correct', async () => {
      UserModel.findById.mockResolvedValue({ _id: 'user123', password: 'hashedpw', save: jest.fn().mockResolvedValue() });
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue('newhashed');
      cache.delete.mockResolvedValue();
      const res = await request(app).put('/api/users/changePassword').send({ currentPassword: 'pw', newPassword: 'npw' });
      expect(res.statusCode).toBe(200);
    });
    it('fails if current password is wrong', async () => {
      UserModel.findById.mockResolvedValue({ _id: 'user123', password: 'hashedpw' });
      bcrypt.compare.mockResolvedValue(false);
      const res = await request(app).put('/api/users/changePassword').send({ currentPassword: 'wrong', newPassword: 'npw' });
      expect(res.statusCode).toBe(400);
    });
    it('fails if user not found', async () => {
      UserModel.findById.mockResolvedValue(null);
      const res = await request(app).put('/api/users/changePassword').send({ currentPassword: 'pw', newPassword: 'npw' });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/users/getall', () => {
    it('returns cached users if present', async () => {
      cache.get.mockResolvedValue([{ _id: 'user1' }]);
      const res = await request(app).get('/api/users/getall');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([{ _id: 'user1' }]);
    });
    it('returns users from DB if not cached', async () => {
      cache.get.mockResolvedValue(null);
      UserModel.find.mockResolvedValue([{ _id: 'user1' }]);
      cache.set.mockResolvedValue();
      const res = await request(app).get('/api/users/getall');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([{ _id: 'user1' }]);
      expect(cache.set).toHaveBeenCalled();
    });
  });

  describe('PUT /api/users/toggleBlock/:userId', () => {
    it('blocks/unblocks user except self', async () => {
      UserModel.findById.mockResolvedValue({ _id: 'user456', isBlocked: false, save: jest.fn().mockResolvedValue(), name: 'Test' });
      cache.delete.mockResolvedValue();
      const res = await request(app).put('/api/users/toggleBlock/user456');
      expect(res.statusCode).toBe(200);
      expect(cache.delete).toHaveBeenCalledWith('user:user456');
    });
    it('cannot block self', async () => {
      const res = await request(app).put('/api/users/toggleBlock/admin123');
      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/users/getById/:userId', () => {
    it('returns cached user if present', async () => {
      cache.get.mockResolvedValue({ _id: 'user1', name: 'Test' });
      const res = await request(app).get('/api/users/getById/user1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ _id: 'user1', name: 'Test' });
    });
    it('returns user from DB if not cached', async () => {
      cache.get.mockResolvedValue(null);
      UserModel.findById.mockResolvedValue({ _id: 'user1', name: 'Test' });
      cache.set.mockResolvedValue();
      const res = await request(app).get('/api/users/getById/user1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ _id: 'user1', name: 'Test' });
      expect(cache.set).toHaveBeenCalled();
    });
  });

  describe('PUT /api/users/update', () => {
    it('updates user info as admin', async () => {
      UserModel.findByIdAndUpdate.mockResolvedValue({});
      cache.delete.mockResolvedValue();
      const res = await request(app).put('/api/users/update').send({ id: 'user456', name: 'Test', email: 'test@example.com', address: 'addr', type: 'user' });
      expect(res.statusCode).toBe(200);
      expect(cache.delete).toHaveBeenCalledWith('user:user456');
    });
  });
});
