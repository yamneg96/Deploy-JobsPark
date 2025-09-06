import PaymentRequest from "../models/PaymentRequest.js";
import User from "../models/User.js";

// =============== Worker creates payment request =================
export const createPaymentRequest = async (req, res) => {
  try {
    const workerId = req.user.id; // logged-in worker
    const { client_id, amount, message } = req.body;

    // Ensure worker exists
    const worker = await User.findById(workerId);
    if (!worker || worker.role !== "worker") {
      return res.status(403).json({ success: false, message: "Only workers can request payments" });
    }

    // Ensure client exists
    const client = await User.findById(client_id);
    if (!client || client.role !== "client") {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    const request = await PaymentRequest.create({
      worker_id: workerId,
      client_id,
      amount,
      message,
    });

    const populated = await request.populate([
      { path: "worker_id", select: "name email phone image" },
      { path: "client_id", select: "name email phone image" },
    ]);

    res.status(201).json({ success: true, request: populated });
  } catch (error) {
    console.error("createPaymentRequest error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =============== Client fetches requests sent to them =================
export const getClientPaymentRequests = async (req, res) => {
  try {
    const clientId = req.user.id;
    const requests = await PaymentRequest.find({ client_id: clientId })
      .populate("worker_id", "name email phone image")
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    console.error("getClientPaymentRequests error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =============== Worker fetches requests they created =================
export const getWorkerPaymentRequests = async (req, res) => {
  try {
    const workerId = req.user.id;
    const requests = await PaymentRequest.find({ worker_id: workerId })
      .populate("client_id", "name email phone image")
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    console.error("getWorkerPaymentRequests error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =============== Client accepts/declines a payment request =================
export const updatePaymentRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body; // accepted | rejected

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const request = await PaymentRequest.findById(requestId);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    if (request.client_id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    request.status = status;
    await request.save();

    res.json({ success: true, message: `Payment request ${status}`, request });
  } catch (error) {
    console.error("updatePaymentRequestStatus error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
