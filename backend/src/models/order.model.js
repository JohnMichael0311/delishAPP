// import { model, Schema } from 'mongoose';
// import { OrderStatus } from '../constants/orderStatus.js';
// import { FoodModel } from './food.model.js';

// export const LatLngSchema = new Schema(
//   {
//     lat: { type: String, required: true },
//     lng: { type: String, required: true },
//   },
//   {
//     _id: false,
//   }
// );

// export const OrderItemSchema = new Schema(
//   {
//     food: { type: FoodModel.schema, required: true },
//     price: { type: Number, required: true },
//     quantity: { type: Number, required: true },
//   },
//   {
//     _id: false,
//   }
// );

// OrderItemSchema.pre('validate', function (next) {
//   this.price = this.food.price * this.quantity;
//   next();
// });

// const orderSchema = new Schema(
//   {
//     name: { type: String, required: true },
//     address: { type: String, required: true },
//     addressLatLng: { type: LatLngSchema, required: true },
//     paymentId: { type: String, index: true },
//     totalPrice: { type: Number, required: true },
//     items: { type: [OrderItemSchema], required: true },
//     status: { type: String, default: OrderStatus.NEW, index: true },
//     user: { type: Schema.Types.ObjectId, required: true, ref: 'user', index: true },
//   },
//   {
//     timestamps: true,
//     toJSON: {
//       virtuals: true,
//     },
//     toObject: {
//       virtuals: true,
//     },
//   }
// );

// // Compound indexes for common queries
// orderSchema.index({ user: 1, status: 1 });
// orderSchema.index({ user: 1, createdAt: -1 });
// orderSchema.index({ status: 1, createdAt: -1 });
// orderSchema.index({ paymentId: 1, status: 1 });

// export const OrderModel = model('order', orderSchema);

import { model, Schema } from 'mongoose';
import { OrderStatus } from '../constants/orderStatus.js';
import { FoodModel } from './food.model.js';

export const LatLngSchema = new Schema(
  {
    lat: { type: String, required: true },
    lng: { type: String, required: true },
  },
  {
    _id: false,
  }
);

export const OrderItemSchema = new Schema(
  {
    food: { type: FoodModel.schema, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  {
    _id: false,
  }
);

OrderItemSchema.pre('validate', function (next) {
  this.price = this.food.price * this.quantity;
  next();
});

const orderSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    addressLatLng: { type: LatLngSchema, required: true },
    paymentId: { type: String, index: true },
    totalPrice: { type: Number, required: true },
    items: { type: [OrderItemSchema], required: true },
    status: { type: String, default: OrderStatus.NEW, index: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'user', index: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Compound indexes for common queries
orderSchema.index({ user: 1, status: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ paymentId: 1, status: 1 });

export const OrderModel = model('order', orderSchema);
