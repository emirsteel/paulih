// backend/models/events.model.ts
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    photo: { type: String }, // Will store the filename or URL
    date: { type: String },
    startTime: { type: String },
    endTime: { type: String },
    locationType: {
      type: String,
      enum: ["fiziksel", "sanal"],
      default: "fiziksel",
    },
    locationLink: { type: String },
    page: { type: mongoose.Schema.Types.ObjectId, ref: "Page", required: true },
    // New participants field: stores an array of user IDs that are participating
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
