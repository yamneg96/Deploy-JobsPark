import { useState } from "react";
import { X, Star } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// New self-contained AddReviewModal component
const AddReviewModal = ({ isOpen, onClose, onSave, app }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!isOpen || !app) return null;

  const handleStarClick = (starIndex) => {
    setRating(starIndex);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (rating > 0 && comment.trim() !== '') {
      onSave({ rating, comment });
    } else {
      // Show a message or prevent submission
      toast.error("Please provide a rating and a comment.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Review {app.applicant.name}'s Work</h2>
        <p className="text-gray-600 mb-6">Job: {app.jobs.title}</p>
        
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Rate their performance:</label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((starIndex) => (
                <Star
                  key={starIndex}
                  className={`w-6 h-6 cursor-pointer ${starIndex <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill='currentColor'
                  onClick={() => handleStarClick(starIndex)}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Leave a comment:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="What did you think of the work?"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReviewModal