// backend/src/models/reportpost.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IReportPost extends Document {
  post: mongoose.Types.ObjectId;
  category: string;
  reason: string;
  reportedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ReportPostSchema: Schema = new Schema({
  post: { type: mongoose.Types.ObjectId, required: true, ref: "Post" },
  category: { type: String, required: true },
  reason: { type: String, required: true },
  reportedBy: { type: mongoose.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IReportPost>("ReportPost", ReportPostSchema);
