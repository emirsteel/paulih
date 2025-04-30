import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema(
  {
    supplierName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    requestType: { type: String, required: true },
    message: { type: String, required: true },
    attachment: { type: String, default: null }, // Stores file path
  },
  { timestamps: true }
);

export const RequestModel = mongoose.model("Request", RequestSchema);
