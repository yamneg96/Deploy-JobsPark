import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // adjust based on your User model
      required: true,
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    type: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship"],
      required: [true, "Job type is required"],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    category: {
      type: String,
      required: [true, "Job category is required"],
    },
     budget: {
      min: { type: Number, required: [true, "Minimum budget is required"] },
      max: { type: Number, required: [true, "Maximum budget is required"] },
    },
   
    
    applications: [
      {
        worker_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: ["applied","pending", "accepted", "rejected"],
          default: "pending",
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    bookmarkedBy: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
