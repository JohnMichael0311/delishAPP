import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      required: true,  // ID from the dummy or real payment method
      unique: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',  // Assuming you have an Order model, change if necessary
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,  // E.g., 'Credit Card', 'PayPal', 'Dummy Payment'
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Completed',  // Default to completed for dummy payment
    },
    date: {
      type: Date,
      default: Date.now,  // Timestamp for the payment
    },
  },
  {
    timestamps: true,  // Automatically manage createdAt and updatedAt
  }
);

export const PaymentModel = mongoose.model('Payment', paymentSchema);
