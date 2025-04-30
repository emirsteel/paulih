import mongoose, { Schema, Document } from "mongoose";

const SupplierSchema = new Schema({
  venueId: { type: Schema.Types.ObjectId, ref: "Venue", required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // Should be hashed in production
});

export interface ISupplier extends Document {
  venueId: string;
  username: string;
  password: string;
}

export const Supplier = mongoose.model<ISupplier>(
  "Supplier",
  SupplierSchema,
  "suppliers"
);
