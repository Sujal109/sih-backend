import mongoose from "mongoose";

const claimSchema = new mongoose.Schema(
  {
    // From form
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
    siteId: { type: String, required: true },
    city: { type: String, required: true },
    walletAddress: { type: String, required: true },
    credits: { type: Number, required: true },

    // File metadata
    cloudinaryUrl: { type: String, required: true },
    ipfsCid: { type: String, required: true },
    evidenceHash: { type: String, required: true },

    // Claim lifecycle
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    txHash: { type: String },
    onchainEvidence: { type: String },
  },
  { timestamps: true }
);

const Claim = mongoose.models.Claim || mongoose.model("Claim", claimSchema);
export default Claim;
