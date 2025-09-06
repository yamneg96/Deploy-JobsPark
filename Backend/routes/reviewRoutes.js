import express from 'express'
import { reviewWorker, getWorkerReviews } from '../controllers/reviewController.js'
import { protect } from '../middleware/auth.js'


const router = express.Router()

// POST a review/rating
router.post('/review/:workerId', protect, reviewWorker);

// Fetch reviews
router.get('/:workerId', protect, getWorkerReviews);


export default router
