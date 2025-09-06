import Request from "../models/request.js";
import User from "../models/User.js";

// ===================== CREATE REQUEST =====================
export const createRequest = async (req, res) => {
  try {
    const clientId = req.user.id; // logged-in client
    const { worker_id, job_id, message } = req.body;

    if (!worker_id) {
      return res.status(400).json({ success: false, message: "worker_id is required" });
    }

    // Verify client & worker exist
    const client = await User.findById(clientId);
    const worker = await User.findById(worker_id);

    if (!client || client.role !== "client") {
      return res.status(403).json({ success: false, message: "Only clients can create requests" });
    }
    if (!worker || worker.role !== "worker") {
      return res.status(404).json({ success: false, message: "Worker not found" });
    }

    const newRequest = await Request.create({
      client_id: clientId,
      worker_id,
      job_id,
      message,
    });

    const populated = await newRequest.populate([
      { path: "client_id", select: "name email phone role image address" },
      { path: "worker_id", select: "name email phone role image address" },
      { path: "job_id", select: "title description" },
    ]);

    res.status(201).json({ success: true, request: populated });
  } catch (error) {
    console.error("createRequest error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== GET WORKER REQUESTS =====================
export const getWorkerRequests = async (req, res) => {
  try {
    const workerId = req.user.id; // use logged-in worker
    const requests = await Request.find({ worker_id: workerId })
      .populate("client_id", "name email phone image address")
      .populate("job_id", "title description")
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    console.error("getWorkerRequests error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===================== UPDATE REQUEST STATUS (worker only) =====================
export const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    if (request.worker_id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    request.status = status;
    await request.save();

    const populated = await request.populate([
      { path: "client_id", select: "name email phone image address" },
      { path: "worker_id", select: "name email phone image address" },
    ]);

    res.json({ success: true, message: `Request ${status}`, request: populated });
  } catch (error) {
    console.error("updateRequestStatus error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===================== GET CLIENT REQUESTS =====================
export const getClientRequests = async (req, res) => {
  try {
    const clientId = req.user.id;
    const requests = await Request.find({ client_id: clientId })
      .populate("worker_id", "name email phone image address")
      .populate("job_id", "title description")
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    console.error("getClientRequests error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===================== FAVORITE TOGGLE =====================
export const toggleFavoriteRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    const index = request.favoriteBy.findIndex(id => id.toString() === userId);

    if (index === -1) {
      request.favoriteBy.push(userId);
    } else {
      request.favoriteBy.splice(index, 1);
    }

    await request.save();

    res.json({ success: true, favorited: index === -1, request });
  } catch (error) {
    console.error("toggleFavoriteRequest error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===================== GET FAVORITES =====================
export const getFavoriteRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await Request.find({ favoriteBy: userId })
      .populate("client_id", "name email phone image address")
      .populate("worker_id", "name email phone image address")
      .populate("job_id", "title description")
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    console.error("getFavoriteRequests error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===================== CLIENT UPDATES PROGRESS =====================
export const updateRequestProgress = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { progress } = req.body;

    if (!["ongoing", "done"].includes(progress)) {
      return res.status(400).json({ success: false, message: "Invalid progress value" });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    if (request.client_id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (request.status !== "accepted") {
      return res.status(400).json({ success: false, message: "Worker has not accepted yet" });
    }

    request.progress = progress;
    await request.save();

    res.json({ success: true, message: `Request marked as ${progress}`, request });
  } catch (error) {
    console.error("updateRequestProgress error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===================== GET REQUEST PROGRESS =====================
export const getRequestProgress = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await Request.findById(requestId).populate([
      { path: "job_id", select: "title description" },
      { path: "client_id", select: "name email phone image address" },
      { path: "worker_id", select: "name email phone image address" },
    ]);

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.status(200).json({
      success: true,
      status: request.status,
      progress: request.progress,
      request,
    });
  } catch (error) {
    console.error("Error fetching request progress:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
