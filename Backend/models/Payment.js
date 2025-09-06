import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    worker: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tx_ref: { type: String, required: true, unique: true }, // unique reference
    amount: { type: Number, required: true },
    currency: { type: String, default: "ETB" },
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
    chapaResponse: { type: Object }, // optional store raw chapa response
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
