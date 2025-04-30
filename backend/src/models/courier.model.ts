import mongoose from "mongoose";

const courierSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const Courier = mongoose.model("Courier", courierSchema);
export default Courier;
