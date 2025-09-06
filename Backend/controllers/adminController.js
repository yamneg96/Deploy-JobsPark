import User from "../models/User.js";
import WorkerProfile from "../models/WorkerProfile.js";
import mongoose from "mongoose";
import imagekit from '../configs/imageKit.js';
import fs from 'fs';

export const updateAdminProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    const user = await User.findById(userId);

    if (!user || user.role !== 'admin') {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Handle image upload
    if (req.file) {
      const uploadedImage = await imagekit.upload({
        file: fs.readFileSync(req.file.path), // file buffer
        fileName: req.file.originalname,
        folder: "client_profiles"
      });
      user.image = uploadedImage.url; // ✅ directly assign image
    }

    // Update allowed fields
    const allowedUpdates = ['name', 'phone', 'gender'];
    allowedUpdates.forEach(field => {
      if (updates[field]) {
        user[field] = updates[field];
      }
    });

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


 // Admin: Delete a user (client or worker)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // user id to delete

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If the user is a worker, remove associated WorkerProfile too
    if (user.role === "worker") {
      await WorkerProfile.findOneAndDelete({ user_id: id });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({ message: `${user.role} deleted successfully` });
  } catch (error) {
    console.error("deleteUser error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Admin: Get all users (optional)
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -resetToken -verificationToken -resetTokenExpires");
    res.status(200).json(users);
  } catch (error) {
    console.error("getAllUsers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
