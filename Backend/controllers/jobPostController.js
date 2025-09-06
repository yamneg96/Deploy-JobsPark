import Job from '../models/Job.js';

//  Create a new job
export const createJob = async (req, res) => {
  try {
    const { title, location, type, description, category, budget } = req.body;

    if (!budget || !budget.min || !budget.max) {
      return res.status(400).json({
        success: false,
        message: "Budget range (min & max) is required",
      });
    }

    const job = new Job({
      client_id: req.user.id, // ✅ automatically set from logged-in user
      title,
      location,
      budget,
      type,
      description,
      category,
    });

    await job.save();

    res.status(201).json({ success: true, job });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get all jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("client_id", "name email image");
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Get single job
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("client_id", "name");
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Update a job
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Only check owner if req.user exists
    if (req.user && job.client_id.toString() !== req.user.id?.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Only allow specific fields to be updated
    const allowedUpdates = ["title", "location", "type", "description", "category", "budget"];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Only check owner if req.user exists
    if (req.user && job.client_id.toString() !== req.user.id?.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await job.deleteOne();
    res.json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle bookmark
export const toggleBookmark = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id; // worker's ID

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    // Check if user already bookmarked
    const index = job.bookmarkedBy.findIndex((id) => id.toString() === userId);
    if (index === -1) {
      // Add bookmark
      job.bookmarkedBy.push(userId);
    } else {
      // Remove bookmark
      job.bookmarkedBy.splice(index, 1);
    }

    await job.save();
    res.json({ success: true, bookmarked: index === -1, job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all bookmarked jobs for the logged-in user
export const getBookmarkedJobs = async (req, res) => {
  try {
    const userId = req.user.id; // logged-in user

    // Find jobs where bookmarkedBy includes this user
    const jobs = await Job.find({ bookmarkedBy: userId })
      .populate("client_id", "name email image"); // include client info if needed

    res.status(200).json({ success: true, jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};