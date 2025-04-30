// backend/src/models/report.model.ts
import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "category", // Dynamically reference User or Group
    },
    category: {
      type: String,
      enum: ["user", "group"],
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    details: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Report", reportSchema);
