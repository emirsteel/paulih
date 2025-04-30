// backend/models/post.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  content: string;
  user?: mongoose.Schema.Types.ObjectId;
  page?: mongoose.Schema.Types.ObjectId;
  media?: string[];
  createdAt: Date;
  likes: ILike[]; // <-- changed
  comments: IComment[];
  music?: IMusic;
  visibility: "Everyone" | "Friends" | "Private";
  anonymous: boolean;
}

export interface ILike {
  user: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

export interface IComment {
  user: mongoose.Schema.Types.ObjectId;
  content: string;
  createdAt: Date;
  likes: mongoose.Schema.Types.ObjectId[];
  replies: IReply[]; // 🔥 replies alanını buraya ekliyoruz
}

export interface IReply {
  user: mongoose.Schema.Types.ObjectId;
  content: string;
  createdAt: Date;
  likes: mongoose.Schema.Types.ObjectId[];
  replies: IReply[]; // 🔥 Yeni alan
}

export interface IMusic {
  name: string;
  artist: string;
  albumImageUrl: string;
  embedUrl: string;
}

// New Like Schema
const LikeSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }, // automatically set like date
});

const ReplySchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  replies: [], // 🔥 Self-reference biraz aşağıda eklenecek
});

// Self-reference ekliyoruz
ReplySchema.add({ replies: [ReplySchema] });

const CommentSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  replies: [ReplySchema], // 🔥 CommentSchema içine replies array ekliyoruz
});

// Music Schema
const MusicSchema: Schema = new Schema({
  name: { type: String, required: true },
  artist: { type: String, required: true },
  albumImageUrl: { type: String, required: true },
  embedUrl: { type: String, required: true },
});

// Post Schema
const PostSchema: Schema = new Schema({
  content: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  page: { type: mongoose.Schema.Types.ObjectId, ref: "Page" },
  media: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  likes: [LikeSchema], // <-- changed
  comments: [CommentSchema],
  music: { type: MusicSchema },
  visibility: {
    type: String,
    enum: ["Everyone", "Friends", "Private"],
    default: "Everyone",
  },
  anonymous: { type: Boolean, default: false },
});

export default mongoose.model<IPost>("Post", PostSchema);
