import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createJob } from '../services/jobAPI';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const JobPost = ({ isOpen, onClose, onPostJob }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [jobType, setJobType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientId, setClientId] = useState(null);

  const { userId } = useAuth(); // ✅ get logged-in userId

  useEffect(() => {
    if (!isOpen) {
      setJobTitle('');
      setLocation('');
      setCategory('');
      setJobType('');
      setDescription('');
      setError(null);
      setMin('');
      setMax('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (userId) {
      setClientId(userId);
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newJob = await createJob(
        {
          title: jobTitle,
          location,
          category,
          type: jobType,
          description,
          budget: {
            min: Number(min),
            max: Number(max),
          },
        },
        clientId
      );

      onPostJob(newJob);
      onClose();
      toast.success('Job Successfully Posted.');
      console.log(newJob);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
      toast.error('Job Posting Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 md:p-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>

          {/* Content */}
          <div className="flex flex-col items-center">
            <h1 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">
              Post a New Job
            </h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <input
                type="text"
                placeholder="Job Title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Min Salary"
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
                  required
                />
                <input
                  type="number"
                  placeholder="Max Salary"
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
                  required
                />
              </div>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
                required
              >
                <option value="">Select Job Type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
              <textarea
                placeholder="Job Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
                rows="4"
                required
              />

              <div className="flex justify-end flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className={`${loading ? 'cursor-progress' : 'cursor-pointer'} bg-gray-200 text-gray-700 px-5 py-2 rounded-xl hover:bg-gray-300 transition-colors shadow-md text-sm sm:text-base`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`${loading ? 'cursor-progress' : 'cursor-pointer'} bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 text-sm sm:text-base`}
                >
                  {loading ? 'Posting...' : 'Post Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
};

export default JobPost;
