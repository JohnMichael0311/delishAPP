import { OrderModel } from '../models/order.model.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('OrderModel', () => {
  let mongoServer;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {});
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
  it('should create and retrieve an order', async () => {
    const order = await OrderModel.create({
      name: 'Test Order',
      address: '123 Main St',
      addressLatLng: { lat: '0', lng: '0' },
      items: [{
        food: {
          name: 'Pizza',
          price: 10,
          cookTime: '10',
          imageUrl: 'http://example.com/image.jpg',
        },
        quantity: 1,
        price: 10,
      }],
      totalPrice: 10,
      status: 'pending',
      user: new mongoose.Types.ObjectId(),
    });
    const found = await OrderModel.findById(order._id);
    expect(found).not.toBeNull();
    expect(found.totalPrice).toBe(10);
  });
});
