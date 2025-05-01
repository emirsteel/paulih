import mongoose, { Schema, Document, Types } from "mongoose";

// Define a subdocument interface for reactions
interface IReaction {
  user: Types.ObjectId;
  emoji: string;
  timestamp: Date;
}

export interface IChatMessage extends Document {
  sender: Types.ObjectId;
  receiver?: Types.ObjectId;
  groupId?: Types.ObjectId;
  message: string;
  timestamp: Date;
  seen: boolean;
  image?: string;
  audio?: string;
  file?: string;
  description?: string;
  fileSize?: number;
  reactions?: IReaction[];
  repliedTo?: Types.ObjectId;
  postId?: Types.ObjectId;
}

const ChatMessageSchema = new Schema<IChatMessage>({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: Schema.Types.ObjectId, ref: "User" },
  groupId: { type: Schema.Types.ObjectId, ref: "Group" },
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
      user: { type: Schema.Types.ObjectId, ref: "User" },
      emoji: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  repliedTo: {
    type: Schema.Types.ObjectId,
    ref: "ChatMessage",
    default: null,
  },
  postId: { type: Schema.Types.ObjectId, ref: "Post" },
});

export default mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);
