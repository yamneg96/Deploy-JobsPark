import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitReview } from "../services/reviewAPI";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ReviewPage = () => {
  const { workerId, userRole } = useAuth(); // workerId passed in route
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      toast.error("Please provide a rating between 1 and 5.");
      return;
    }
    try {
      const res = await submitReview(workerId, { rating, comment });
      toast.success("Review submitted successfully!");
      console.log(res);
      navigate("/client"); // redirect client back to dashboard
    } catch (err) {
      toast.error(err.message || "Failed to submit review.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <Link
            to={`${BASE_URL}/${userRole}`}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className='inline mr-2' />
            Go Back
          </Link>
        <h2 className="text-2xl font-bold text-center mb-6">Leave a Review</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Rating (1–5)
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className={`w-10 cursor-pointer h-10 rounded-full border flex items-center justify-center text-lg font-bold transition ${
                    rating >= star
                      ? "bg-yellow-400 text-white border-yellow-500"
                      : "bg-gray-200 text-gray-600 border-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                >
                  {star}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Feedback
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Write your feedback here..."
            ></textarea>
          </div>

          <button
            type="submit"
            className=" cursor-pointer w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-xl shadow-md hover:scale-105 transition"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewPage;
