// venues.model.ts
import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

const ActiveDaySchema = new Schema({
  day: { type: String, required: true },
  open: { type: String, required: true },
  close: { type: String, required: true },
});

const VenueSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  rating: { type: Number, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  logo: { type: String, required: true },
  photos: [{ type: String, required: false }],
  description: { type: String, required: true },
  deliveryTime: { type: String, required: true },
  deliveryPrice: { type: String, required: true },
  minimumPayment: { type: String, required: true },
  discount: { type: String, required: true },
  likedBy: [{ type: String }],
  deliveryBy: { type: String, required: false },
  paymentMethod: [{ type: String, required: false }],
  menu: [{ type: String, required: true }],
  activeDays: [ActiveDaySchema],

  // New field: Banner image
  banner: { type: String, required: false },
});

export interface IVenue extends Document {
  name: string;
  username: string;
  password: string;
  category: string;
  subcategory: string;
  location: {
    address: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  rating: number;
  phone: string;
  email: string;
  logo: string;
  photos?: string[];
  description: string;
  deliveryTime: string;
  deliveryPrice: string;
  minimumPayment: string;
  discount: string;
  likedBy: string[];
  deliveryBy?: string;
  paymentMethod?: string[];
  menu: string[];
  activeDays: {
    day: string;
    open: string;
    close: string;
  }[];

  // New field
  banner?: string;
}

VenueSchema.pre("save", async function (next) {
  if (!this.username) {
    this.username = this.name.toLowerCase().replace(/\s+/g, "");
  }

  if (this.isModified("password") && !this.password.startsWith("$2b$")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

export const Venue = mongoose.model<IVenue>("Venue", VenueSchema, "venues");
