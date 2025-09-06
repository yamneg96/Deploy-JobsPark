import express from "express";
import { createPayment, chapaWebhook, verifyPayment, getWorkerPayments } from "../controllers/paymentController.js";
import { protect } from "../middleware/auth.js"; // assuming you have auth

const router = express.Router();

// Client initiates payment
router.post("/", protect, createPayment);

// Chapa webhook
router.post("/webhook", chapaWebhook);

// Worker fetches payment history
router.get("/worker/history", protect, getWorkerPayments);

// Manual verify
router.get("/verify/:tx_ref", verifyPayment);

export default router;
