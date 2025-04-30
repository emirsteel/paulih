import mongoose, { Schema, Document } from "mongoose";

export interface IGroup extends Document {
  name: string;
  image: string;
  members: mongoose.Types.ObjectId[]; // Array of user IDs
  createdAt: Date;
}

const GroupSchema: Schema = new Schema({
  name: { type: String, required: true },
  image: { type: String },
  members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IGroup>("Group", GroupSchema);
