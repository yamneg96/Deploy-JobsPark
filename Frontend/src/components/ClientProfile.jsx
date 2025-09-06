import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchClientProfile, updateClientProfile } from '../services/profileAPI';

const ClientProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
    image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetchClientProfile();
        const { name, phone, gender, image } = res.data;
        setFormData({ name: name || '', phone: phone || '', gender: gender || '', image: null });
        if (image) setPreviewImage(image);
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

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Please enter your name');
      return;
    }

    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('phone', formData.phone);
      fd.append('gender', formData.gender);
      if (formData.image) {
        fd.append('image', formData.image);
      }

      await updateClientProfile(fd);
      // navigate(`${BASE_URL}/${userRole}`)
      navigate(-1);
      toast.success('Profile updated successfully!');
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
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden"
            onClick={handleAvatarClick}
          >
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

        <div className="space-y-6 max-w-md mx-auto">
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
              required
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Phone number"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

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

export default ClientProfile;