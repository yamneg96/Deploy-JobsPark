import React from 'react'
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

// Simple self-contained EditJobModal component
const EditJobModal = ({ isOpen, onClose, job, onSave }) => {
  const [editedJob, setEditedJob] = useState(job || {});

  useEffect(() => {
    setEditedJob(job || {});
  }, [job]);

  if (!isOpen || !job) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedJob(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave(editedJob);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit Job: {job.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSave} className="w-full space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Job Title:</label>
                <input
                  type="text"
                  name="title"
                  value={editedJob.title || ''}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="e.g., Front-End Developer"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Location:</label>
                <input
                  type="text"
                  name="location"
                  value={editedJob.location || ''}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="e.g., New York, NY"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Category:</label>
                  <input
                    type="text"
                    name="category"
                    value={editedJob.category || ''}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="e.g., Engineering"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Job Type:</label>
                  <select
                    name="jobType"
                    value={editedJob.jobType || ''}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                  >
                    <option value="">Select Job Type</option>
                    <option value="full-time">Full-Time</option>
                    <option value="part-time">Part-Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Job Description:</label>
                <textarea
                  name="description"
                  value={editedJob.description || ''}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Describe the job responsibilities..."
                  rows="4"
                  required
                ></textarea>
              </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJobModal