
import express from 'express';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

//  protected route
router.get('/admin-dashboard', protect, authorize('admin'), (req, res) => {
  res.json({ message: 'Admin dashboard ' });
});

// Client route 
router.get('/client-dashboard', protect, authorize('client'), (req, res) => {
  res.json({ message: 'Client dashboard ' });
});

// Worker route
router.get('/worker-dashboard', protect, authorize('worker'), (req, res) => {
  res.json({ message: 'Worker dashboard ' });
});

export default router;