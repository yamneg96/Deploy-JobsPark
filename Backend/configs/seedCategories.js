import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectDB from './db.js'; 

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import ServiceCategory from '../models/ServiceCategory.js';
import Service from '../models/Service.js';

const seedCategories = async () => {
  try {
    await connectDB(); 

    const categories = [
      { name: 'Cleaning', group: 'Home Service', active: true },
      { name: 'Plumbing', group: 'Home Service', active: true },
      { name: 'Electrical Repairs', group: 'Home Service', active: true },
      { name: 'Gardening', group: 'Home Service', active: true },
      { name: 'Math Tutoring', group: 'Education and Tutoring', active: true },
      { name: 'Language Lessons', group: 'Education and Tutoring', active: true },
      { name: 'Music Lessons', group: 'Education and Tutoring', active: true },
      { name: 'Test Preparation', group: 'Education and Tutoring', active: true }
    ];

    await ServiceCategory.deleteMany({});
    const categoryResult = await ServiceCategory.insertMany(categories);

    const services = [
      {
        title: "Professional House Cleaning",
        description: "Thorough cleaning service for your home",
        category: categoryResult[0]._id,
        provider: new mongoose.Types.ObjectId(),
        jobType: "contract",
        tags: ["cleaning", "home"],
      },
      {
        title: "Emergency Plumbing Repair",
        description: "24/7 plumbing services for leaks and clogs",
        category: categoryResult[1]._id,
        provider: new mongoose.Types.ObjectId(),
        jobType: "contract",
        tags: ["plumbing", "emergency"],
      }
    ];

    await Service.deleteMany({});
    await Service.insertMany(services);

    console.log(` Categories and services seeded successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('SEEDING FAILED:', error.message);
    process.exit(1);
  }
};

seedCategories();
