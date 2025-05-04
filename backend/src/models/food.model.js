import { model, Schema } from 'mongoose';

export const FoodSchema = new Schema(
  {
    name: { type: String, required: true, index: true },
    price: { type: Number, required: true, index: true },
    tags: { type: [String], index: true },
    favorite: { type: Boolean, default: false },
    stars: { type: Number, default: 3, index: true },
    imageUrl: { type: String, required: true },
    origins: { type: [String], required: true },
    cookTime: { type: String, required: true },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

// Compound indexes for common queries
FoodSchema.index({ name: 1, tags: 1 });
FoodSchema.index({ price: 1, stars: 1 });
FoodSchema.index({ favorite: 1, stars: -1 });

export const FoodModel = model('food', FoodSchema);
