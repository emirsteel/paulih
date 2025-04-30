import mongoose, { Schema, Document } from "mongoose";

export interface PromoCode extends Document {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  expiryDate: Date;
  isActive: boolean;
}

const PromoCodeSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true },
  type: { type: String, enum: ["percentage", "fixed"], required: true },
  value: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
});

export default mongoose.model<PromoCode>("PromoCode", PromoCodeSchema);
