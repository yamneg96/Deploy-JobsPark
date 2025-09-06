import User from "../models/User.js"; 
import WorkerProfile from '../models/WorkerProfile.js';
import imagekit from '../configs/imageKit.js';
import fs from 'fs';

export const getWorkerById = async (req, res) => {
  try {
    const workerId = req.params.id.trim();

    const worker = await User.findById(workerId).select(
      '-password -resetToken -resetTokenExpires -verificationToken'
    );

    if (!worker || worker.role !== 'worker') {
      return res.status(404).json({ message: 'Worker not found' });
    }

    const profile = await WorkerProfile.findOne({ user_id: workerId });

    const workerData = {
      ...worker.toObject(),
      image: worker.image,   //  ensure image from User is exposed
      profile: profile || null,
    };

    res.status(200).json(workerData);
  } catch (error) {
    console.error('Error fetching worker:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// Publicly fetchable worker profile
export const getWorkerProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await WorkerProfile.findOne({ user_id: id })
      .populate("user_id", "name email role image phone gender") // include image here
      .lean();

    if (!profile) {
      return res.status(404).json({ message: "Worker profile not found" });
    }

    res.status(200).json(profile);
  } catch (err) {
    console.error("getWorkerProfile error:", err.message);
    res.status(500).json({ message: "Error retrieving worker profile" });
  }
};

export const getAllWorkers = async (req, res) => {
  try {
    const workers = await User.aggregate([
      { $match: { role: "worker" } }, // only workers
      {
        $lookup: {
          from: "workerprofiles",      // collection name in MongoDB (lowercase + plural)
          localField: "_id",           // User._id
          foreignField: "user_id",     // WorkerProfile.user_id
          as: "profile"
        }
      },
      {
        $project: {
          password: 0,
          resetToken: 0,
          verificationToken: 0,
          verificationTokenExpires: 0,
          resetTokenExpires: 0,
          __v: 0
        }
      }
    ]);

    res.status(200).json(workers);
  } catch (error) {
    console.error("Error fetching workers:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

//  Update worker profile with info from User
export const updateWorkerProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      bio,
      skills,
      experience_years,
      availability_status,
      services,
      pricing,
      availabilityCalendar,
      name,
      phone,
      gender
    } = req.body;

    let imageURL;
    let portfolioItems = [];

    // Upload profile image
    if (req.files?.image) {
      const imageFile = req.files.image[0];
      const uploadedImage = await imagekit.upload({
        file: fs.readFileSync(imageFile.path),
        fileName: imageFile.originalname,
        folder: 'worker_profiles',
      });
      imageURL = uploadedImage.url;
      fs.unlinkSync(imageFile.path);
    }

    // Upload portfolio files
    if (req.files?.portfolio) {
      for (const file of req.files.portfolio) {
        const uploaded = await imagekit.upload({
          file: fs.readFileSync(file.path),
          fileName: file.originalname,
          folder: 'worker_portfolios',
        });
        portfolioItems.push({ url: uploaded.url, caption: file.originalname });
        fs.unlinkSync(file.path);
      }
    }

    // Parse availabilityCalendar
    let parsedCalendar;
    if (availabilityCalendar) {
      try {
        parsedCalendar = JSON.parse(availabilityCalendar);
      } catch (err) {
        return res.status(400).json({ message: 'Invalid availabilityCalendar format' });
      }
    }

    //  Step 1: Update User base info
    const userUpdate = {};
    if (name) userUpdate.name = name;
    if (phone) userUpdate.phone = phone;
    if (gender) userUpdate.gender = gender;
    if (imageURL) userUpdate.image = imageURL;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: userUpdate },
      { new: true }
    ).select("name phone gender image");

    // Step 2: Update WorkerProfile
    const updateFields = {
      bio,
      skills,
      experience_years,
      availability_status,
      services,
      pricing,
      ...(parsedCalendar && { availabilityCalendar: parsedCalendar }),
    };

    if (portfolioItems.length > 0) updateFields.portfolio = portfolioItems;

    const updatedProfile = await WorkerProfile.findOneAndUpdate(
      { user_id: userId },
      {
        ...updateFields,
        name: updatedUser.name,
        phone: updatedUser.phone,
        gender: updatedUser.gender,
        image: updatedUser.image,
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating profile" });
  }
};
