import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  toggleBookmark,
  getBookmarkedJobs,
} from "../controllers/jobPostController.js";
import { protect } from "../middleware/auth.js"; // auth middleware

const router = express.Router();


router.get("/bookmarked", protect, getBookmarkedJobs);
// Public routes
router.get("/all-posted-jobs", getJobs);              // GET all jobs
router.get("/:id", getJobById);        // GET single job by id

// Protected routes (require login)
router.post("/", protect, createJob);               // Create job
router.put("/:id", protect, updateJob);             // Update job
router.delete("/:id", protect, deleteJob);          // Delete job
router.patch("/:jobId/bookmark", protect, toggleBookmark);


export default router;
