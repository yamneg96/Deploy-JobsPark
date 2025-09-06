import mongoose from 'mongoose'

const WorkerProfileSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: { type: String, required: true },
  skills: { type: [String], required: true },
  experience_years: { type: Number, default: 0 },
  availability_status: { type: String, enum: ['Available', 'Busy', 'Offline'], default: 'Available' },
  rating: { type: Number, default: 0 },
  

  // New fields
  services: [{ type: String }], // e.g. ["Plumbing", "Cleaning"]
  pricing: { type: Number },
  portfolio: [{ url: String, caption: String }],
  availabilityCalendar: [{
    date: Date,
    isAvailable: Boolean
  }],

  // New: reviews by clients
  reviews: [
    {
      client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String },
      createdAt: { type: Date, default: Date.now },
    }
  ]
}, { timestamps: true })

export default mongoose.model('WorkerProfile', WorkerProfileSchema)