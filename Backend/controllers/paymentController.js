
import axios from "axios";
import Payment from "../models/Payment.js";
import User from "../models/User.js";

// Create new payment
export const createPayment = async (req, res) => {
  try {
    const clientId = req.user.id; // logged in user (client)
    const { workerId, amount } = req.body;

    // check that worker exists
    const worker = await User.findById(workerId);
    if (!worker) {
      return res.status(404).json({ error: "Worker not found" });
    }

    const client = await User.findById(clientId);

    const tx_ref = `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Initialize payment with Chapa
    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount,
        currency: "ETB",
        email: client.email,
        first_name: client.name,
        last_name: "", // optional
        tx_ref,
        callback_url: `${process.env.BASE_URL}/api/payments/verify/${tx_ref}`,
        return_url: `${process.env.FRONTEND_URL}/payment-success?tx_ref=${tx_ref}`,
        customization: {
          title: "Worker Payment",
          description: `Payment from ${client.name} to ${worker.name}`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data || response.data.status !== "success") {
      return res.status(400).json({ error: "Payment initialization failed" });
    }

    // Save payment record
    const newPayment = new Payment({
      client: clientId,
      worker: workerId,
      tx_ref,
      amount,
      status: "pending",
      chapaResponse: response.data,
    });

    await newPayment.save();

    return res.json({
      success: true,
      checkout_url: response.data.data.checkout_url,
      tx_ref,
    });
  } catch (error) {
    console.error("Chapa init error:", error.response?.data || error.message);
    res.status(500).json({ error: "Payment initialization failed" });
  }
};

// Verify payment manually
export const verifyPayment = async (req, res) => {
  try {
    const { tx_ref } = req.params;

    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    const payment = await Payment.findOne({ tx_ref });
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    if (response.data.data.status === "success") {
      payment.status = "success";
    } else {
      payment.status = "failed";
    }
    await payment.save();

    res.json({ success: true, status: payment.status, chapa: response.data });
  } catch (error) {
    console.error("Verify error:", error.response?.data || error.message);
    res.status(500).json({ error: "Verification failed" });
  }
};

// Webhook
export const chapaWebhook = async (req, res) => {
  try {
    const { tx_ref, status } = req.body;

    const payment = await Payment.findOne({ tx_ref });
    if (payment) {
      payment.status = status === "success" ? "success" : "failed";
      await payment.save();
    }

    res.status(200).send("Webhook received");
  } catch (error) {
    res.status(500).send("Webhook error");
  }
};

// Get payments received by a worker
export const getWorkerPayments = async (req, res) => {
  try {
    const workerId = req.user.id; // logged-in worker

    // Fetch all successful payments for this worker
    const payments = await Payment.find({ worker: workerId })
      .populate("client", "name email") // populate client info
      .sort({ createdAt: -1 }); // latest first

    res.json(payments);
  } catch (error) {
    console.error("Get worker payments error:", error.message);
    res.status(500).json({ error: "Failed to fetch worker payments" });
  }
};
