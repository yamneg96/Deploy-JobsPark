
import mongoose from "mongoose";

const PaymentRequestSchema = new mongoose.Schema(
  {
    worker_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    message: { type: String },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "paid"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("PaymentRequest", PaymentRequestSchema);
