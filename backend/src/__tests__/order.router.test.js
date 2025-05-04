const request = require('supertest');
const express = require('express');
const handler = require('express-async-handler');
const { OrderModel } = require('../models/order.model.js');
const { UserModel } = require('../models/user.model.js');
const { cache, CACHE_TTL } = require('../utils/simpleCache.js');
const orderRouter = require('../routers/order.router.js').default || require('../routers/order.router.js');
const auth = require('../middleware/auth.mid.js');
const { OrderStatus } = require('../constants/orderStatus.js');

jest.mock('../models/order.model.js');
jest.mock('../models/user.model.js');
jest.mock('../utils/simpleCache.js', () => {
  return {
    cache: {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      client: { connect: jest.fn(), quit: jest.fn() },
    },
    CACHE_TTL: { ORDER: 3600 }
  };
});
jest.mock('../middleware/auth.mid.js', () => (req, res, next) => {
  req.user = { id: 'user123', type: 'customer', email: 'test@example.com' };
  next();
});

describe('Order Router', () => {
  let app;
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/order', orderRouter);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });
  afterAll(() => {
    jest.resetAllMocks();
  });

  describe('POST /order/create', () => {
    it('creates a new order when cart is not empty', async () => {
      const mockOrder = {
        _id: 'order123',
        user: 'user123',
        items: [{ foodId: 'f1', quantity: 2 }],
        totalAmount: 20
      };
      OrderModel.mockImplementation(() => ({ save: jest.fn().mockResolvedValue(mockOrder) }));
      OrderModel.deleteOne.mockResolvedValue();
      cache.delete.mockResolvedValue();
      const res = await request(app).post('/order/create').send(mockOrder);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({});
    });
    it('returns 400 when cart is empty', async () => {
      const res = await request(app).post('/order/create').send({ items: [], totalAmount: 0 });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('PUT /order/pay', () => {
    it('pays for an order', async () => {
      const mockOrder = { _id: 'order123', status: OrderStatus.NEW, user: 'user123', save: jest.fn().mockResolvedValue() };
      // getNewOrderForCurrentUser is used in router, which calls OrderModel.findOne().populate().
      OrderModel.findOne.mockReturnValue({ populate: jest.fn().mockResolvedValue(mockOrder) });
      cache.delete.mockResolvedValue();
      jest.spyOn(require('../helpers/mail.helper.js'), 'sendEmailReceipt').mockImplementation(() => {});
      const res = await request(app).put('/order/pay').send({ paymentId: 'pay_1' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({});
    });
    it('returns 400 if order not found', async () => {
      OrderModel.findOne.mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });
      const res = await request(app).put('/order/pay').send({ paymentId: 'pay_1' });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /order/newOrderForCurrentUser', () => {
    it('returns cached new order if present', async () => {
      const mockOrder = { _id: 'order123', status: OrderStatus.NEW, user: 'user123' };
      cache.get.mockResolvedValue(mockOrder);
      const res = await request(app).get('/order/newOrderForCurrentUser');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockOrder);
    });
    it('fetches new order from DB and caches if not present', async () => {
      cache.get.mockResolvedValue(null);
      const mockOrder = { _id: 'order123', status: OrderStatus.NEW, user: 'user123' };
      OrderModel.findOne.mockReturnValue({ populate: jest.fn().mockResolvedValue(mockOrder) });
      cache.set.mockResolvedValue();
      const res = await request(app).get('/order/newOrderForCurrentUser');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockOrder);
      expect(cache.set).toHaveBeenCalled();
    });
  });

  describe('GET /order', () => {
    it('returns cached orders if present', async () => {
      const mockOrders = [{ _id: 'order1', user: 'user123' }];
      cache.get.mockResolvedValue(mockOrders);
      UserModel.findById = jest.fn().mockResolvedValue({ _id: 'user123', type: 'customer' });
      const res = await request(app).get('/order');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockOrders);
    });
    it('fetches orders from DB and caches if not present', async () => {
      cache.get.mockResolvedValue(null);
      const mockOrders = [{ _id: 'order1', user: 'user123' }];
      UserModel.findById = jest.fn().mockResolvedValue({ _id: 'user123', type: 'customer' });
      // OrderModel.find().sort() chain
      const sortMock = jest.fn().mockResolvedValue(mockOrders);
      OrderModel.find.mockReturnValue({ sort: sortMock });
      cache.set.mockResolvedValue();
      const res = await request(app).get('/order');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockOrders);
      expect(cache.set).toHaveBeenCalled();
    });
  });
});
