import mongoose, { Schema, Document } from "mongoose";

export interface IChatMessage extends Document {
  sender: mongoose.Types.ObjectId;
  receiver?: mongoose.Types.ObjectId;
  groupId?: mongoose.Types.ObjectId;
  message: string;
  timestamp: Date;
  seen: boolean;
  image?: string;
  audio?: string;
  file?: string;
  description?: string;
  fileSize?: number;
  reactions?: {
    user: mongoose.Types.ObjectId;
    emoji: string;
    timestamp: Date;
  }[];
  repliedTo?: mongoose.Types.ObjectId; // For replies
  postId?: mongoose.Types.ObjectId; // NEW: Reference to the shared post
}

const ChatMessageSchema = new Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  seen: { type: Boolean, default: false },
  image: { type: String },
  audio: { type: String },
  file: { type: String },
  description: { type: String },
  fileSize: { type: Number },
  reactions: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      emoji: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  repliedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatMessage",
    default: null,
  },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }, // NEW
});

export default mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);
