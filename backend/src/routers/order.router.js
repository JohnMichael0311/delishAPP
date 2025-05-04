import { Router } from 'express';
import handler from 'express-async-handler';
import auth from '../middleware/auth.mid.js';
import { BAD_REQUEST, UNAUTHORIZED } from '../constants/httpStatus.js';
import { OrderModel } from '../models/order.model.js';
import { OrderStatus } from '../constants/orderStatus.js';
import { UserModel } from '../models/user.model.js';
import { sendEmailReceipt } from '../helpers/mail.helper.js';
import { UserType } from '../constants/userType.js';
// import { cache } from '../utils/simpleCache.js';
import { cache, CACHE_TTL } from '../utils/simpleCache.js';


const router = Router();
router.use(auth);


/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - items
 *         - totalAmount
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               foodId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *         totalAmount:
 *           type: number
 *       example:
 *         items: [
 *           { "foodId": "12345", "quantity": 2 },
 *           { "foodId": "67890", "quantity": 1 }
 *         ]
 *         totalAmount: 29.99
 */

/**
 * @swagger
 * /order/create:
 *   post:
 *     summary: Create a new order
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */

/**
 * @swagger
 * /order/pay:
 *   put:
 *     summary: Pay for an order
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderId:
 *                   type: string
 */

router.post(
  '/create',
  handler(async (req, res) => {
    const order = req.body;

    if (order.items.length <= 0) res.status(BAD_REQUEST).send('Cart Is Empty!');

    await OrderModel.deleteOne({
      user: req.user.id,
      status: OrderStatus.NEW,
    });

    const newOrder = new OrderModel({ ...order, user: req.user.id });
    await newOrder.save();

    // Invalidate caches
    await cache.delete(`user:${req.user.id}:newOrder`);
    await cache.delete(`order:${newOrder._id}`);

    res.send(newOrder);
  })
);

router.put(
  '/pay',
  handler(async (req, res) => {
    const { paymentId } = req.body;
    const order = await getNewOrderForCurrentUser(req);
    if (!order) {
      res.status(BAD_REQUEST).send('Order Not Found!');
      return;
    }

    order.paymentId = paymentId;
    order.status = OrderStatus.PAYED;
    await order.save();

    // Invalidate caches
    await cache.delete(`order:${order._id}`);
    await cache.delete(`user:${req.user.id}:newOrder`);

    sendEmailReceipt(order);

    res.send(order._id);
  })
);

// router.post('/payment', async (req, res) => {
//   const { paymentId, orderId, amount, paymentMethod, status, date } = req.body;

//   try {
//     // Save the payment details
//     const payment = new PaymentModel({
//       orderId,
//       paymentId,
//       amount,
//       paymentMethod,
//       status,
//       date,
//     });
//     await payment.save();

//     // Optionally, you can update the order status as well
//     await OrderModel.findByIdAndUpdate(orderId, { status: 'Paid' });

//     res.status(201).json({ orderId });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to save payment' });
//   }
// });

router.get(
  '/track/:orderId',
  handler(async (req, res) => {
    const { orderId } = req.params;
    const user = await UserModel.findById(req.user.id);
    const filter = {
      _id: orderId,
    };

    if (user.type !== UserType.ADMIN) {
      filter.user = user._id;
    }

    const cacheKey = `orders:track:${orderId}`;
    const cachedOrder = await cache.get(cacheKey);
    
    if (cachedOrder) {
      return res.json(cachedOrder);
    }

    const order = await OrderModel.findOne(filter);

    if (!order) return res.send(UNAUTHORIZED);

    await cache.set(cacheKey, order, CACHE_TTL.ORDER);
    res.send(order);
  })
);

router.get(
  '/newOrderForCurrentUser',
  handler(async (req, res) => {
    const cacheKey = `user:${req.user.id}:newOrder`;
    const cachedOrder = await cache.get(cacheKey);
    
    if (cachedOrder) {
      return res.json(cachedOrder);
    }

    const order = await getNewOrderForCurrentUser(req);
    await cache.set(cacheKey, order, CACHE_TTL.ORDER);
    res.send(order);
  })
);

// Static data, no need for caching
router.get('/allstatus', (req, res) => {
  const allStatus = Object.values(OrderStatus);
  res.send(allStatus);
});

router.get(
  '/:status?',
  handler(async (req, res) => {
    const status = req.params.status;
    const user = await UserModel.findById(req.user.id);
    const filter = {};

    if (user.type != "admin") filter.user = user._id;
    if (status) filter.status = status;

    const cacheKey = `orders:list:${user._id}:${status || 'all'}`;
    const cachedOrder = await cache.get(cacheKey);
    
    if (cachedOrder) {
      return res.json(cachedOrder);
    }

    const orders = await OrderModel.find(filter).sort('-createdAt');
    await cache.set(cacheKey, orders, CACHE_TTL.ORDER);
    res.send(orders);
  })
);

const getNewOrderForCurrentUser = async req =>
  await OrderModel.findOne({
    user: req.user.id,
    status: OrderStatus.NEW,
  }).populate('user');
export default router;
