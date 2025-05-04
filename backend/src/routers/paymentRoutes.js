// import express from 'express';
// import { PaymentModel } from '../models/payment.model.js';  // The payment model created earlier

// const router = express.Router();

// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     Payment:
//  *       type: object
//  *       required:
//  *         - paymentId
//  *         - orderId
//  *         - amount
//  *       properties:
//  *         paymentId:
//  *           type: string
//  *         orderId:
//  *           type: string
//  *         amount:
//  *           type: number
//  *         paymentMethod:
//  *           type: string
//  *         status:
//  *           type: string
//  *         date:
//  *           type: string
//  *       example:
//  *         paymentId: "abc123"
//  *         orderId: "12345"
//  *         amount: 29.99
//  *         paymentMethod: "Credit Card"
//  *         status: "Completed"
//  *         date: "2025-05-01T12:00:00Z"
//  */

// /**
//  * @swagger
//  * /payment/payment:
//  *   post:
//  *     summary: Save payment information
//  *     tags: [Payment]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/Payment'
//  *     responses:
//  *       201:
//  *         description: Payment saved successfully
//  */


// // Define the POST route to handle payments
// router.post('/payment', async (req, res) => {
//   try {
//     const { paymentId, orderId, amount, paymentMethod, status, date } = req.body;

//     // Create a new payment document in the database
//     const payment = new PaymentModel({
//       paymentId,
//       orderId,
//       amount,
//       paymentMethod,
//       status: status || 'Completed',  // Default status
//       date: date || Date.now(),  // Set current date if not provided
//     });

//     await payment.save();

//     // Return a success response
//     res.status(201).json({ message: 'Payment saved successfully' });
//   } catch (error) {
//     console.error('Error saving payment:', error);
//     res.status(500).json({ error: 'Failed to save payment' });
//   }
// });

// export default router;

import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Route to create a Payment Intent
router.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  // Ensure amount is provided and is a valid number
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Amount is required and must be a positive number' });
  }

  const amountInCents = amount * 100;  // Convert amount to cents (smallest currency unit)

  try {
    // Create PaymentIntent with the received amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,           // Amount in cents
      currency: 'usd',                 // Currency in USD (you can change this)
      automatic_payment_methods: { enabled: true },
    });

    // Send clientSecret to frontend
    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe Error:', error.message);
    return res.status(500).json({ error: 'Payment creation failed' });
  }
});

export default router;