import express from "express";
import { createRequest, getClientRequests, getFavoriteRequests,  getRequestProgress, getWorkerRequests, toggleFavoriteRequest,  updateRequestProgress, updateRequestStatus } from "../controllers/requestController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Client creates request → /api/requests
router.post("/",protect,  createRequest);

// Worker views requests → /api/requests/my
router.get("/my",protect,  getWorkerRequests);
router.patch("/:requestId/status", protect, updateRequestStatus);  //worker accepts/rejects
router.get("/client-request-status",protect, getClientRequests); //clients can see the status of their requests
router.patch("/:requestId/favorite", protect, toggleFavoriteRequest); 
router.get("/favorites", protect, getFavoriteRequests); 
router.patch("/:requestId/progress", protect, updateRequestProgress);//client can done or ongoing
router.get("/:requestId/progress", protect, getRequestProgress);

export default router;
