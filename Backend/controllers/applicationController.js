import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import mongoose from "mongoose";


// Create new application
export const createApplication = async (req, res) => {
  try {
    const workerId = req.user.id; // logged-in worker

    // Fetch worker info
    const worker = await User.findById(workerId).select("name email phone role");
    if (!worker || worker.role !== "worker") {
      return res.status(403).json({ success: false, message: "Only workers can apply" });
    }

    const { job_id } = req.body;

    // Ensure the job exists
    const job = await Job.findById(job_id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    // Prevent duplicate applications
    const existing = await Application.findOne({ job_id, worker_id: workerId });
    if (existing) return res.status(400).json({ success: false, message: "Already applied" });

    const newApplication = new Application({
      job_id,
      worker_id: workerId,
      name: worker.name,
      email: worker.email,
      phone: worker.phone,
      resume: req.file ? req.file.filename : undefined,
      status: "applied",
    });

    await newApplication.save();

    // Add to Job's applications array
    job.applications.push({ worker_id: workerId, status: "applied" });
    await job.save();

    res.status(201).json({ success: true, message: "Application submitted", application: newApplication });
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Fetch applications for a job (e.g. for client/recruiter dashboard)
export const getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ job_id: jobId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Fetch applications created by a worker
export const getApplicationsByWorker = async (req, res) => {
  try {
    const workerId = req.user.id; // use logged-in worker instead of req.params

    const applications = await Application.find({ worker_id: workerId })
      .populate("job_id", "title description location type category") // add more job details
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      applications: applications.map(app => ({
        _id: app._id,
        job: app.job_id,
        status: app.status,      //  show accepted/rejected/pending/applied
        appliedAt: app.createdAt
      }))
    });
  } catch (error) {
    console.error("Error fetching worker applications:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Client accepts or rejects an application
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body; // accepted | rejected

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    // Find the application
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // Find the job to ensure the logged-in client owns it
    const job = await Job.findById(application.job_id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.client_id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Update Application model
    application.status = status;
    await application.save();

    // Also update job.applications array (keep them in sync)
    const jobApplication = job.applications.find(
      (app) => app.worker_id.toString() === application.worker_id.toString()
    );
    if (jobApplication) {
      jobApplication.status = status;
    }
    await job.save();

    res.json({
      success: true,
      message: `Application ${status} successfully`,
      application,
    });
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Worker removes their own application
export const deleteApplication = async (req, res) => {
  try {
    const workerId = req.user.id;
    const { applicationId } = req.params;

    // Find application
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // Ensure the logged-in worker owns this application
    if (application.worker_id.toString() !== workerId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Remove application
    await Application.findByIdAndDelete(applicationId);

    // Also remove from Job.applications array
    await Job.findByIdAndUpdate(application.job_id, {
      $pull: { applications: { worker_id: workerId } },
    });

    res.json({ success: true, message: "Application withdrawn successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
