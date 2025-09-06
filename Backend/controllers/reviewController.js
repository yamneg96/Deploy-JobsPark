import WorkerProfile from '../models/WorkerProfile.js';

export const reviewWorker = async (req, res) => {
  try {
    const { workerId } = req.params; // workerId is the User _id
    const { rating, comment } = req.body;
    const clientId = req.user.id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    // Find worker profile by user_id
    const worker = await WorkerProfile.findOne({ user_id: workerId });
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });

    // Check if client already reviewed
    const existingReviewIndex = worker.reviews.findIndex(
      (r) => r.client_id.toString() === clientId
    );

    if (existingReviewIndex !== -1) {
      // Update existing review
      worker.reviews[existingReviewIndex].rating = rating;
      worker.reviews[existingReviewIndex].comment = comment;
      worker.reviews[existingReviewIndex].createdAt = Date.now();
    } else {
      // Add new review
      worker.reviews.push({ client_id: clientId, rating, comment });
    }

    // Update average rating
    const totalRating = worker.reviews.reduce((sum, r) => sum + r.rating, 0);
    worker.rating = totalRating / worker.reviews.length;

    await worker.save();

    res.json({ success: true, message: 'Review submitted', worker });
  } catch (error) {
    console.error('reviewWorker error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getWorkerReviews = async (req, res) => {
  try {
    const { workerId } = req.params;

    // Find worker profile
    const worker = await WorkerProfile.findOne({ user_id: workerId }).populate('reviews.client_id', 'name email');
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    res.json({ success: true, reviews: worker.reviews });
  } catch (error) {
    console.error('getWorkerReviews error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};