import { model, Schema } from 'mongoose';

export const UserSchema = new Schema(
  {
    name: { type: String, required: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    type: { type: String, required: true, default: "user", enum: ["user", "restaurant", "admin"], index: true },
    isBlocked: { type: Boolean, default: false, index: true },
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
UserSchema.index({ type: 1, isBlocked: 1 });
UserSchema.index({ email: 1, type: 1 });
UserSchema.index({ name: 1, type: 1 });

export const UserModel = model('user', UserSchema);
