import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchWorkerProfile, updateWorkerProfile } from '../services/auth';

const WorkerProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
    bio: '',
    skills: '',
    experienceYears: '',
    availabilityStatus: 'Available',
    image: null,
    services: '',
    pricing: '',
    portfolio: [],
    availabilityCalendar: '',
  });

  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const portfolioInputRef = useRef(null);
  const { userRole, prof, workerName } = useAuth();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetchWorkerProfile();
        const profile = res.data;
        setFormData({
          name: profile.name || '',
          phone: profile.phone || '',
          gender: profile.gender || '',
          bio: profile.bio || '',
          skills: profile.skills || '',
          experienceYears: profile.experience_years || '',
          availabilityStatus: profile.availability_status || 'Available',
          image: null,
          services: profile.services || '',
          pricing: profile.pricing || '',
          portfolio: [],
          availabilityCalendar: profile.availabilityCalendar || '',
        });
        if (profile.image) setPreviewImage(profile.image);
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        alert('Please select an image file (JPEG, PNG)');
        return;
      }
      if (file.size > 2000000) {
        alert('Image size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData((prev) => ({ ...prev, image: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePortfolioChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, portfolio: files }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handlePortfolioClick = () => {
    portfolioInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.bio || !formData.skills) {
      alert('Please at least fill skills and bio');
      return;
    }

    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('phone', formData.phone);
      fd.append('gender', formData.gender);
      fd.append('bio', formData.bio);
      fd.append('skills', formData.skills);
      fd.append('experience_years', formData.experienceYears);
      fd.append('availability_status', formData.availabilityStatus);
      fd.append('services', formData.services);
      fd.append('pricing', formData.pricing);
      fd.append('availabilityCalendar', JSON.stringify([{ date: formData.availabilityCalendar, isAvailable: true }]));

      if (formData.image) {
        fd.append('image', formData.image);
      }

      if (formData.portfolio.length > 0) {
        formData.portfolio.forEach((file) => {
          fd.append('portfolio', file);
        });
      }

      await updateWorkerProfile(fd);
      toast.success('Profile updated successfully!');
      navigate(-1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg my-8">
      <Link to={`${BASE_URL}/${userRole}`} className='flex gap-2 text-blue-500'>
        <ArrowLeft />
        <h3>Back to Dashboard</h3>
      </Link>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center mb-8" onClick={handleAvatarClick}>
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden">
            {previewImage ? (
              <img src={previewImage} alt="Profile preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500">Upload Photo</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleAvatarClick}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            {previewImage ? 'Change Photo' : 'Add Photo'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Full Name"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="phone">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Phone Number"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="gender">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Bio <span className="text-red-500">*</span>
              </label>
              <textarea
                name="bio"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Skills <span className="text-red-500">*</span>
              </label>
              <input
                name="skills"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Plumbing, Electrical, etc."
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Services
              </label>
              <input
                name="services"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.services}
                onChange={handleChange}
                placeholder="Plumbing, Cleaning, etc."
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Pricing
              </label>
              <input
                type="number"
                name="pricing"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.pricing}
                onChange={handleChange}
                placeholder="400 ETB"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Portfolio
              </label>
              <input
                type="file"
                name="portfolio"
                multiple
                accept=".pdf,image/*"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={handlePortfolioChange}
                ref={portfolioInputRef}
              />
              <button
                type="button"
                onClick={handlePortfolioClick}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Upload Portfolio Files
              </button>

              {formData.portfolio.length > 0 && (
                <ul className="mt-2 text-sm text-gray-600">
                  {formData.portfolio.map((file, i) => (
                    <li key={i}>{file.name}</li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Availability Calendar
              </label>
              <input
                type="date"
                name="availabilityCalendar"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.availabilityCalendar}
                onChange={handleChange}
                placeholder="Availability date"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Experience (Years)
              </label>
              <input
                type="number"
                name="experienceYears"
                min="0"
                max="50"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.experienceYears}
                onChange={handleChange}
                placeholder="Enter years of experience"
              />
            </div>

            {/* Availability Status */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Availability Status
              </label>
              <select
                name="availabilityStatus"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.availabilityStatus}
                onChange={handleChange}
              >
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
                <option value="Busy">Busy</option>
                <option value="On Vacation">On Vacation</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center mt-10">
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium text-lg shadow-md hover:shadow-lg cursor-pointer"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkerProfile;
