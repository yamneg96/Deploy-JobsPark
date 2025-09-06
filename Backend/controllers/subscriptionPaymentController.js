import axios from "axios";
import SubscriptionPayment from "../models/SubscriptionPayment.js";
import User from "../models/User.js";

const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY; 

// Subscription prices in ETB
const SUBSCRIPTION_PRICES = {
  monthly: 100,   // monthly subscription amount
  yearly: 1000    // yearly subscription amount
};

// 1. INITIATE PAYMENT
// 1. INITIATE PAYMENT
export const initiatePayment = async (req, res) => {
  try {
    const { subscriptionType, amount } = req.body; // take amount too
    const userId = req.user.id;

    // Validate subscriptionType
    if (!["monthly", "yearly"].includes(subscriptionType)) {
      return res.status(400).json({ success: false, message: "Invalid subscription type" });
    }

    // Use frontend amount OR fallback to default mapping
    const finalAmount = amount || SUBSCRIPTION_PRICES[subscriptionType];

    if (!finalAmount || isNaN(finalAmount)) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    // Unique transaction reference
    const tx_ref = `tx-${Date.now()}-${userId}`;
    const user = await User.findById(userId);

    // Save in DB
    const payment = await SubscriptionPayment.create({
      user: userId,
      payerRole: user.role,
      amount: finalAmount,          //  dynamic amount
      subscriptionType,
      chapaTxRef: tx_ref
    });

    // Call Chapa API
    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount: finalAmount,        // ✅ send dynamic amount
        currency: "ETB",
        email: user.email,
        first_name: user.name,
        tx_ref,
        callback_url: `http://localhost:5000/api/payments/verify/${tx_ref}`,
        return_url: `${process.env.FRONTEND_URL}/subscription-success?tx_ref=${tx_ref}`,
        customization: {
          title: "JobsPark Subs",
          description: `Subscription for ${subscriptionType}`
        }
      },
      {
        headers: { Authorization: `Bearer ${CHAPA_SECRET_KEY}` }
      }
    );

    res.status(200).json({
      success: true,
      checkout_url: response.data.data.checkout_url,
      payment
    });

  } catch (error) {
    console.error("Chapa init error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Payment initiation failed" });
  }
};



// 2. VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  try {
    const { tx_ref } = req.params;  

    // Call Chapa verify API
    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: { Authorization: `Bearer ${CHAPA_SECRET_KEY}` }
      }
    );

    const status = response.data.data.status;

    // Update DB with latest status
    const payment = await SubscriptionPayment.findOneAndUpdate(
      { chapaTxRef: tx_ref },
      { status },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    if (status === "success") {
      await User.findByIdAndUpdate(payment.user, { isSubscribed: true });
    }

    res.status(200).json({
      success: true,
      tx_ref,
      status,
      payment
    });
  } catch (error) {
    console.error("Verify error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};


// 3. GET USER PAYMENTS
export const getMyPayments = async (req, res) => {
  try {
    const payments = await SubscriptionPayment.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, payments });  
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching payments" });
  }
};

// 4. ADMIN - GET ALL PAYMENTS
export const getAllPayments = async (req, res) => {
  try {
    const payments = await SubscriptionPayment.find()
      .populate("user", "name email role") // show user details
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching all payments" });
  }
};