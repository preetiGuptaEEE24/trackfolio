import mongoose from "mongoose";

const STATUS_VALUES = ["Wishlist", "Applied", "OA", "Interview", "Offer", "Rejected"];

const applicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    status: { type: String, enum: STATUS_VALUES, default: "Applied" },
    appliedDate: { type: Date, default: Date.now },
    link: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

export const STATUSES = STATUS_VALUES;
export default mongoose.model("Application", applicationSchema);
