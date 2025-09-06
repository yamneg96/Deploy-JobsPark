import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { applyJobs } from '../services/applicationAPI';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext'; // Assuming you have a similar context for the user

const ApplicationForm = ({ isOpen, onClose, currentJob }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, userId } = useAuth(); // Get logged-in userId
  const [applicantId, setApplicantId] = useState(null);

  // State for the form inputs
  const [applicationFormData, setApplicationFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null,
  });

  // Effect to reset form when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      setApplicationFormData({
        name: '',
        email: '',
        phone: '',
        resume: null,
      });
      setError(null);
    }
  }, [isOpen]);

  // Effect to set the applicant ID once the userId is available
  useEffect(() => {
    if (userId) {
      setApplicantId(userId);
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setApplicationFormData((prevState) => ({
      ...prevState,
      resume: e.target.files[0],
    }));
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Make sure currentJob and currentJob._id exist before proceeding
    if (!currentJob || !currentJob._id) {
        setError('Job ID is missing. Cannot submit application.');
        setLoading(false);
        toast.error('Job ID missing. Application failed.');
        return;
    }

    const formData = new FormData();
    formData.append('applicant_id', applicantId);
    // ✅ FIX: Use currentJob._id instead of currentJob.id
    formData.append('job_id', currentJob._id); 
    formData.append('name', applicationFormData.name);
    formData.append('email', applicationFormData.email);
    formData.append('phone', applicationFormData.phone);
    formData.append('resume', applicationFormData.resume);

    try {
      const newApplication = await applyJobs(formData);
      onClose();
      toast.success('Job Successfully Applied.');
      console.log(newApplication);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply to job');
      toast.error('Job Application Failed');
    } finally {
      setLoading(false);
    }
  };

  // If the form is not meant to be open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      {/* Semi-transparent blurred background */}
      <div className="absolute inset-0 backdrop-blur-xs"></div>

      {/* Form container with luxury styling */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-2xl p-8 w-full max-w-md mx-4 border border-gray-200">
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <FaTimes size={20} />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Apply for Position</h3>
          <p className="text-blue-600 font-medium">{currentJob?.title}</p>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleApplySubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={user.name || applicationFormData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={user.email || applicationFormData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={user.phone || applicationFormData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resume/CV</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p className="text-sm text-gray-500">
                    {applicationFormData.resume ? applicationFormData.resume.name : 'Click to upload resume'}
                  </p>
                </div>
                <input
                  type="file"
                  name="resume"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`cursor-pointer w-full mt-6 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50`}
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
