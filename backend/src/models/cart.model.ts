import mongoose, { Schema, Document } from "mongoose";

interface ICartProduct {
  productId: mongoose.Types.ObjectId; // Reference to the Product model
  quantity: number;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  products: ICartProduct[];
}

const CartSchema = new Schema<ICart>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, default: 1 },
    },
  ],
});

export const Cart = mongoose.model<ICart>("Cart", CartSchema);
