import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  walletAddress: { type: String, required: true},
  data: { type: Map, of: mongoose.Schema.Types.Mixed }, // flexible key-value pairs
}, { timestamps: true });

export default mongoose.model("UserData", dataSchema);
