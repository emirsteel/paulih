import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  supplierUsername: string;
  supplierId: mongoose.Schema.Types.ObjectId;
  items: {
    productId: mongoose.Schema.Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
    totalItemPrice: number;
  }[];
  totalAmount: number;
  taxAmount: number;
  deliveryFee: number;
  estimatedDeliveryTime: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryInstructions?: string;
  paymentMethod: "Credit/Debit Card" | "PayPal" | "Cash on Delivery";
  status: "Pending" | "Processing" | "Delivered" | "Cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    supplierUsername: { type: String, required: true },
    supplierId: { type: Schema.Types.ObjectId, ref: "Venue", required: true },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        totalItemPrice: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    estimatedDeliveryTime: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    deliveryCity: { type: String, required: true },
    deliveryInstructions: { type: String, default: null },
    paymentMethod: {
      type: String,
      enum: ["Credit/Debit Card", "PayPal", "Cash on Delivery"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", OrderSchema, "orders");
