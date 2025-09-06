import API from "./axios";

// Submit a review for a worker
export const submitReview = async (workerId, { rating, comment }) => {
  try {
    const res = await API.post(`/reviews/review/${workerId}`, { rating, comment });
    return res.data;
  } catch (err) {
    console.error("Error submitting review:", err);
    throw err.response?.data || { success: false, message: "Failed to submit review" };
  }
};

// Fetch reviews for a worker
export const fetchWorkerReviews = async (workerId) => {
  try {
    const token = sessionStorage.getItem('token');
    const res = await API.get(`/reviews/${workerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error('fetchWorkerReviews error:', err);
    return { success: false, reviews: [] };
  }
};
