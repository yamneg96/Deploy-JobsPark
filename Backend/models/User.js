import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import Request from "./request.js";
import Job from './Job.js';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true }, 
  password: { type: String, required: true, select: false }, 
  role: { type: String, enum: ['client', 'worker', 'admin'], default: 'client' },
  address: { type: String, required: true }, // Human-readable address
  language: { type: String }, 
  gender: { type: String, enum: ['male', 'female'], required: true },
  latitude: {type: Number},
  longitude: {type: Number},
  image:{type: String, default:''},
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  verificationTokenExpires: Date,
  resetToken: String,
  resetTokenExpires: Date
}, { timestamps: true })


//userSchema.index({ location: '2dsphere' });


// Hash password before saving only if it’s plain text
userSchema.pre('save', async function (next) {
  // Detect if password looks like a bcrypt hash already (starts with $2)
  if (!this.isModified('password')) return next();

  if (this.password.startsWith('$2')) {
    console.warn('Warning: password looks already hashed — skipping hash');
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


// Helper method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Cascade delete requests when a user is deleted
userSchema.pre("findOneAndDelete", async function (next) {
  const user = await this.model.findOne(this.getFilter());
  if (user) {
    // Delete all requests where this user is client or worker
    await Request.deleteMany({
      $or: [{ client_id: user._id }, { worker_id: user._id }]
    });

    // Delete all jobs created by this user if they are a client
    if (user.role === 'client') {
      await Job.deleteMany({ client_id: user._id });
    }

    // Delete applications if worker
    if (user.role === 'worker') {
      await Application.deleteMany({ worker_id: user._id });
    }
  }
  next();
});


export default mongoose.model('User', userSchema)

