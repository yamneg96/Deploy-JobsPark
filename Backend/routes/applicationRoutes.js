import express from "express";
import upload from "../middleware/multer.js";
import { createApplication, deleteApplication, getApplicationsByJob, getApplicationsByWorker, updateApplicationStatus } from "../controllers/applicationController.js";
import  {protect }from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, upload.single("resume"), createApplication);

// Worker sees their own applications
router.get("/my", protect, getApplicationsByWorker);

router.get("/:jobId", protect, getApplicationsByJob); // Client sees applications for a job they own


// Update application status (accept / reject)
router.put("/:applicationId/status", protect,  updateApplicationStatus);

// Worker deletes their application
router.delete("/:applicationId", protect, deleteApplication);


export default router;
