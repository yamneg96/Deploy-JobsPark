import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  createPaymentRequest,
  getClientPaymentRequests,
  getWorkerPaymentRequests,
  updatePaymentRequestStatus
} from "../controllers/paymentRequestController.js";

const paymentRequestRouter = express.Router();

paymentRequestRouter.post("/", protect, authorize("worker"), createPaymentRequest);
paymentRequestRouter.get("/client", protect, authorize("client"), getClientPaymentRequests);
paymentRequestRouter.get("/worker", protect, authorize("worker"), getWorkerPaymentRequests);
paymentRequestRouter.put("/:requestId", protect, authorize("client"), updatePaymentRequestStatus);

export default paymentRequestRouter;
