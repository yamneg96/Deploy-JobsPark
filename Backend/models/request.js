import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    worker_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job", // optional: if requests are tied to jobs
    },
    // controlled by worker
    message: { type: String },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    // controlled by client (after worker accepted)
    progress: {
      type: String,
      enum: ["ongoing", "done"],
      default: "ongoing",
    },
    favoriteBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", requestSchema);
export default Request;
