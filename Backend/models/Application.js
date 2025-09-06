import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    job_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    worker_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   // assuming your worker is stored in User collection
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    resume: { type: String }, // file path or filename
    status: {
      type: String,
      enum: ["applied", "pending", "accepted", "rejected"],
      default: "applied", // when worker creates application
    },
  },
  { timestamps: true }
);

export default mongoose.model("Application", ApplicationSchema);
