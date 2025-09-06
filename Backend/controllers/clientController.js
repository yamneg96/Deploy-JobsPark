import mongoose from "mongoose";
import imagekit from '../configs/imageKit.js';
import User from '../models/User.js';
import fs from 'fs';

export const getClientById = async (req, res) => {
  try {
    const clientId = req.params.id.trim();

    // Validate ObjectId before querying
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({ message: 'Invalid client ID format' });
    }

    // Fetch client and exclude sensitive fields
    const client = await User.findById(clientId).select(
      '-password -resetToken  -resetTokenExpires -verificationToken'
    );

    if (!client || client.role !== 'client') {
      return res.status(404).json({ message: 'Client not found' });
    }

    if (client.role !== 'client') {
      return res.status(400).json({ message: 'User is not a client' });
    }

    res.status(200).json({
      message: 'Client fetched successfully',
      client: client.toObject(), // convert to plain object (same as worker code style)
    });
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllClients = async (req, res) => {
  try {
    // Fetch all users with role 'client', exclude sensitive fields
    const clients = await User.find({ role: 'client' }).select(
      '-password -resetToken -resetTokenExpires -verificationToken'
    );

    if (!clients || clients.length === 0) {
      return res.status(404).json({ message: 'No clients found' });
    }

    res.status(200).json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



export const updateClientProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    const user = await User.findById(userId);

    if (!user || user.role !== 'client') {
      return res.status(404).json({ message: 'Client not found' });
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

