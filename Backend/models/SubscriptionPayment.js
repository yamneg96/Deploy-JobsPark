import mongoose from "mongoose";

const paymentSchemas = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  payerRole: { type: String, enum: ["client", "worker"], required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "ETB" },
  status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  chapaTxRef: { type: String, required: true }, // Chapa transaction reference
  subscriptionType: { type: String, enum: ["monthly", "yearly"], required: true }

}, { timestamps: true });

export default mongoose.model("SubscriptionPayment", paymentSchemas);
