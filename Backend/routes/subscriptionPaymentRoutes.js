import express from "express";
import { initiatePayment, verifyPayment, getMyPayments ,getAllPayments} from "../controllers/subscriptionPaymentController.js";
import { protect,isAdmin } from "../middleware/auth.js";

const subscriptionPaymentRouter = express.Router();

// User starts subscription payment
subscriptionPaymentRouter.post("/initiate", protect, initiatePayment);

// Chapa calls this after payment
subscriptionPaymentRouter.get("/verify/:tx_ref", verifyPayment);

// User views their payments
subscriptionPaymentRouter.get("/my-payments", protect, getMyPayments);

// Admin only
subscriptionPaymentRouter.get("/all", protect, isAdmin, getAllPayments);

export default subscriptionPaymentRouter;
