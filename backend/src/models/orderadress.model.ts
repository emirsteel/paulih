import mongoose from "mongoose";

const OrderAddressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    addressTitle: { type: String, required: true },
    apartment: { type: String },
    flat: { type: String },
    floor: { type: String },
    phoneNumber: { type: String, required: true },
    addressDescription: { type: String, required: true },
    noteToCourier: { type: String },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    selectedTag: {
      type: String,
      enum: ["home", "work", "school", "heart"],
      required: true,
    },
    isSelected: { type: Boolean, default: false }, // ✅ Selected address field
  },
  { timestamps: true }
);

const OrderAddress = mongoose.model("OrderAddress", OrderAddressSchema);
export default OrderAddress;
