// Payment model: backend/src/models/payment.model.ts
import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["Credit/Debit Card", "PayPal", "Cash on Delivery"],
      required: true,
    },
    status: { type: String, enum: ["Success", "Failed"], default: "Success" },
    orderStatus: { type: String, default: "Order Taken" }, // Default order status
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        category: String,
        image: String,
        quantity: Number,
        extraSideChoice: [{ name: String, price: Number }],
        sauces: [{ name: String }],
      },
    ],
    venue: {
      venueId: { type: mongoose.Schema.Types.ObjectId, ref: "Venue" },
      name: String,
      category: String,
      location: {
        address: String,
        city: String,
      },
    },
    // New field for delivery address
    deliveryAddress: {
      addressTitle: String,
      apartment: String,
      flat: String,
      floor: String,
      phoneNumber: String,
      addressDescription: String,
      latitude: Number,
      longitude: Number,
      selectedTag: String,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", PaymentSchema);
export default Payment;
