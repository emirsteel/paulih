// src/models/notifications.model.ts
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // receiver
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  type: {
    type: String,
    enum: ["notification", "like", "comment", "share"],
    default: "notification",
  },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Notification", notificationSchema);
