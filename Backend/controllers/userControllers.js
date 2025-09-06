// controllers/userController.js
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import WorkerProfile from '../models/WorkerProfile.js'
import { geocodeAddress } from '../utils/geocoder.js';
import dotenv from 'dotenv';

dotenv.config();

// Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ========== Register Client API ==========
export const registerClient = async (req, res) => {
  try {
    const { name, email, password, phone, gender, language, address, latitude, longitude } = req.body;

    if (!name || !email || !password || password.length < 8 || !phone || !gender || !address || !latitude || !longitude) {
      return res.status(400).json({ message: 'Please fill all fields properly.' });
    }

    const validGenders = ['male', 'female'];
    if (!validGenders.includes(gender.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid gender selected.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Optionally geocode address here (commented out)
    // const geoData = await geocodeAddress(address);
    

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const verificationTokenExpires =
    Date.now() + (Number(process.env.VERIFICATION_TOKEN_TTL_MS) || 60_000)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address, // Original user-input address
      latitude,
      longitude,
      gender,
      language,
      role: 'client',
      verificationToken,
      verificationTokenExpires
    });

    // IMPORTANT: send verification link to BACKEND endpoint so backend can update DB
    const verificationUrl = `${process.env.BACKEND_ROOT || 'http://localhost:5000'}/api/users/verify-email/${verificationToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Verify your Email (valid 1 minute)',
      html: `<p>Hello ${user.name},</p>
             <p>Thank you for registering at JobSpark. Please verify your email by clicking the link below:</p>
             <p><a href="${verificationUrl}">Verify Email</a></p>
             <p>If the link doesn't work, copy and paste this URL into your browser:</p>
             <p>${verificationUrl}</p>`
    });
     
    return res.status(201).json({ message: 'Registered successfully! Please check your email.' });
    

  } catch (error) {
    console.error('registerClient error:', error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
}

// ========== Register Worker API ==========
export const registerWorker = async (req, res) => {
  try {
    const { name, email, password, phone, gender, language, address, bio, skills, latitude, longitude } = req.body;

    if (!name || !email || !password || !phone || password.length < 8 || !gender || !address || !latitude || !longitude) {
      return res.status(400).json({ message: 'Please fill all fields properly.' });
    }

    const validGenders = ['male', 'female'];
    if (!validGenders.includes(gender.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid gender selected.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Optionally geocode address here (commented out)
    // const geoData = await geocodeAddress(address);

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires =
    Date.now() + (Number(process.env.VERIFICATION_TOKEN_TTL_MS) || 60_000)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address, // Original user-input address
      latitude,
      longitude,
      bio,
      skills,
      gender,
      language,
      role: 'worker',
      verificationToken,
      verificationTokenExpires
    });

    // Create worker profile
    await WorkerProfile.create({
      user_id: user._id,
      bio: bio || '',
      skills: skills || '',
      experience_years: 0,
      availability_status: 'available',
      rating: 0,
      image: ''
    });

    const verificationUrl = `${process.env.BACKEND_ROOT || 'http://localhost:5000'}/api/users/verify-email/${verificationToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Verify your Email (valid 1 minute)',
      html: `<p>Hello ${user.name},</p>
             <p>Please verify your email by clicking the link below:</p>
             <p><a href="${verificationUrl}">Verify Email</a></p>
             <p>If the link doesn't work, copy and paste this URL into your browser:</p>
             <p>${verificationUrl}</p>`
    });

    return res.status(201).json({ message: 'Worker registered. Please verify your email.' });
  } catch (error) {
    console.error('registerWorker error:', error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
}

// ========== Register Admin API ==========
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, phone, gender, language, address, latitude, longitude } = req.body;

    if (!name || !email || !password || password.length < 8 || !phone || !gender || !address || !latitude || !longitude) {
      return res.status(400).json({ message: 'Please fill all fields properly.' });
    }

    const validGenders = ['male', 'female'];
    if (!validGenders.includes(gender.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid gender selected.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Optionally geocode address here (commented out)
    // const geoData = await geocodeAddress(address);
    

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const verificationTokenExpires =
    Date.now() + (Number(process.env.VERIFICATION_TOKEN_TTL_MS) || 60_000)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address, // Original user-input address
      latitude, 
      longitude,
      gender,
      language,
      role: 'admin',
      verificationToken,
      verificationTokenExpires
    });

    // IMPORTANT: send verification link to BACKEND endpoint so backend can update DB
    const verificationUrl = `${process.env.BACKEND_ROOT || 'http://localhost:5000'}/api/users/verify-email/${verificationToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Verify your Email (valid 1 minute)',
      html: `<p>Hello ${user.name},</p>
             <p>Thank you for registering at JobSpark. Please verify your email by clicking the link below:</p>
             <p><a href="${verificationUrl}">Verify Email</a></p>
             <p>If the link doesn't work, copy and paste this URL into your browser:</p>
             <p>${verificationUrl}</p>`
    });
     
    return res.status(201).json({ message: 'Registered successfully! Please check your email.' });
    

  } catch (error) {
    console.error('registerAdmin error:', error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
}


// ========== verifyEmail ==========
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.redirect(`${process.env.FRONTEND_ROOT || 'http://localhost:5173'}/login?verified=false`);
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_ROOT || 'http://localhost:5173'}/login?verified=false`);
    }

    if (user.isVerified) {
      return res.redirect(`${process.env.FRONTEND_ROOT || 'http://localhost:5173'}/login?alreadyVerified=true`);
    }

    // Clear both token and token expiry
    await User.updateOne(
      { verificationToken: token },
      { 
        $set: { 
          isVerified: true, 
          verificationToken: null, 
          verificationTokenExpires: null 
        } 
      }
    );

    console.log(`User ${user.email} verified successfully.`);
    return res.redirect(`${process.env.FRONTEND_ROOT || 'http://localhost:5173'}/login?verified=true`);
  } catch (error) {
    console.error('Email verification error:', error);
    return res.redirect(`${process.env.FRONTEND_ROOT || 'http://localhost:5173'}/login?verified=false`);
  }
};

// ======== resend verification email=======
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (user.isVerified) return res.status(400).json({ message: 'Account already verified' })

    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpires =
      Date.now() + (Number(process.env.VERIFICATION_TOKEN_TTL_MS) || 60_000)

    await User.updateOne(
      { _id: user._id },
      { verificationToken, verificationTokenExpires }
    )

    const verificationUrl = `${process.env.BACKEND_ROOT || 'http://localhost:5000'}/api/users/verify-email/${verificationToken}`

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Resend: Verify your Email (valid 1 minute)',
      html: `<p>Hello ${user.name},</p>
             <p>Your new verification link (valid <b>1 minute</b>):</p>
             <p><a href="${verificationUrl}">Verify Email</a></p>
             <p>${verificationUrl}</p>`
    })

    res.json({ message: 'Verification email resent' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Could not resend verification email' })
  }
}



// ========== Request Password Reset ==========
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `${process.env.FRONTEND_ROOT || 'http://localhost:5173'}/reset-password/${resetToken}`;
    await transporter.sendMail({
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset Request',
      html: `<p>Hello ${user.name},</p>
             <p>Reset your password by clicking the link below. Link valid for 1 hour:</p>
             <p><a href="${resetLink}">Reset Password</a></p>
             <p>If the link doesn't work, copy and paste this URL into your browser:</p>
             <p>${resetLink}</p>`
    });

    return res.status(200).json({ message: 'Reset email sent.' });
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ message: 'Reset failed.', error: error.message });
  }
}

// ========== Reset Password ==========
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    

    if (!password || password.trim().length < 6) {
      return res.status(400).json({ message: "Password is required and must be at least 6 characters" });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    
    user.password =password

    // clear reset fields
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("resetPassword error:", error);
    return res.status(500).json({ message: "Reset error" });
  }
};



