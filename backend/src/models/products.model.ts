import mongoose, { Schema, Document, Types } from "mongoose";

export interface IExtraSideChoice {
  name: string;
  price: number;
}

export interface ISauce {
  name: string;
}

// New interface for Lavash Choice
export interface ILavashChoice {
  name: string;
  // Optional: if you want to include a price or other property
  price?: number;
}

export interface IProduct extends Document {
  venueId: Types.ObjectId;
  name: string;
  image: string;
  description: string;
  price: number;
  category: string;
  choiceExtracted: string[]; // Ingredients the buyer doesn't want
  extraSideChoice: IExtraSideChoice[]; // Extra food options
  sauces: ISauce[]; // Unlimited sauce options
  promotions: Types.ObjectId[]; // References to other products
  lavashChoices: ILavashChoice[]; // Lavash options for döner products
  extraTavukDonerChoice?: { name: string; price: number }; // Extra tavuk döner choice (optional)
  glutenFree: boolean; // New glutenFree column
  rated: number; // New rated column (for example, a rating score)
}

const ExtraSideChoiceSchema = new Schema<IExtraSideChoice>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const SauceSchema = new Schema<ISauce>({
  name: { type: String, required: true },
});

// New schema for Lavash Choice
const LavashChoiceSchema = new Schema<ILavashChoice>({
  name: { type: String, required: true },
  price: { type: Number, default: 0 }, // Optional price if needed
});

const ProductSchema = new Schema<IProduct>({
  venueId: { type: Schema.Types.ObjectId, ref: "Venue", required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  choiceExtracted: { type: [String], default: [] },
  extraSideChoice: { type: [ExtraSideChoiceSchema], default: [] },
  sauces: { type: [SauceSchema], default: [] },
  promotions: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  lavashChoices: { type: [LavashChoiceSchema], default: [] },
  extraTavukDonerChoice: {
    type: { name: String, price: Number },
    default: undefined,
  },
  glutenFree: { type: Boolean, default: false }, // New field
  rated: { type: Number, default: 0 }, // New field
});

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
