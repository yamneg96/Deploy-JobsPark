// Register.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast'; // Import Toaster for toast notifications
import { Eye, EyeOff, User, Mail, Phone, UserCircle, LocateFixedIcon, Languages, LifeBuoy, Network } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Terms from '../components/Terms';
import { registerClient, registerWorker ,registerAdmin} from '../services/auth'; // Assuming these functions are defined in your API module
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue
  } = useForm();

  const selectedRole = watch('role');

  // Function to get the user's location
  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    const success = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const GEO_API_URL = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
      fetch(GEO_API_URL)
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(data => {
          const city = data.locality || "City not found";
          const lat = data.latitude || "latitude not found";
          const lon = data.longitude || "longitude not found";
          setValue('address', city);
          setValue('latitude', lat);
          setValue('longitude', lon);
        })
        .catch(error => {
          console.error('Error fetching location data:', error);
        });
    };

    const error = (err) => {
      console.error(`Error (${err.code}): ${err.message}`);
    };

    getUserLocation();
  }, [setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    console.log('Register payload:', data);
    try {
      if (data.role === 'client') {
        await registerClient(data);
      } else if (data.role === 'worker') {
        await registerWorker(data);
      } else if (data.role === 'admin') {
        await registerAdmin(data);
      } else {
        throw new Error('Invalid role selected');
      }
      toast.success('Registration successful! Check your email for verification.');
      reset();
    } catch (error) {
      const msg = error?.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleShowTerms = () => setShowTermsPopup(true);
  const handleCloseTerms = () => setShowTermsPopup(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Toaster for notifications */}
      <Toaster /> 

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create Your Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join JobSpark and start your journey
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md mx-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 relative">
                <input
                  id="name"
                  name='name'
                  {...register('name', { 
                    required: 'Full name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  })}
                  type="text"
                  autoComplete="name"
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your full name"
                />
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Please enter a valid email address',
                    }
                  })}
                  type="email"
                  autoComplete="email"
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your email"
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative">
                <input
                  id="phone"
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[\+]?[1-9][\d]{0,15}$/,
                      message: 'Please enter a valid phone number'
                    }
                  })}
                  type="tel"
                  autoComplete="tel"
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your phone number"
                />
                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <div className="mt-1 relative">
                <input
                  id="address"
                  {...register('address', { 
                    required: 'Address is required',
                    minLength: { value: 2, message: 'Address must be at least 2 characters' }
                  })}
                  type="text"
                  onFocus={() => toast("Address has been auto filled no need to change.", { duration: 3000, icon: 'ℹ️' })}
                  autoComplete="address"
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-yellow-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your Address"
                />
                <LocateFixedIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>
          
            {/* Latitude */}
            <input
              type="hidden"
              id="latitude"
              {...register('latitude', { required: 'Latitude is required' })}
            />

            {/* Longitude */}
            <input
              type="hidden"
              id="longitude"
              {...register('longitude', { required: 'Longitude is required' })}/>

            {/* Language */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                Language
              </label>
              <div className="mt-1 relative">
                <input
                  id="language"
                  {...register('language', { 
                    required: 'Language is required',
                    minLength: { value: 2, message: 'Location must be at least 2 characters' }
                  })}
                  type="text"
                  autoComplete="off"
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your Language"
                />
                <Languages className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.language && (
                <p className="mt-1 text-sm text-red-600">{errors.language.message}</p>
              )}
            </div>

            {/* Gender Selection */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <div className="mt-1 relative">
                <select
                  id="gender"
                  {...register('gender', { required: 'Please select your gender' })}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <UserCircle className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                I want to join as
              </label>
              <div className="mt-1 relative">
                <select
                  id="role"
                  {...register('role', { required: 'Please select a role' })}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select your role</option>
                  <option value="client">Client (I need to hire)</option>
                  <option value="worker">Worker (I want to work)</option>
                  <option value="admin">Admin (I am an admin)</option>
                </select>
                <UserCircle className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 cursor-pointer" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 cursor-pointer" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Role-specific information */}
            {selectedRole && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="bg-blue-50 p-4 rounded-lg"
              >
                <h4 className="font-medium text-blue-900 mb-2">
                  {selectedRole === 'client' ? 'As a Client, you can:' : 
                   selectedRole === 'worker' ? 'As a Worker, you can:' : 
                   'As an Admin, you can:'}
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  {selectedRole === 'client' && (
                    <>
                      <li>• Post job opportunities</li>
                      <li>• Browse and hire skilled workers</li>
                      <li>• Manage your projects and bookings</li>
                      <li>• Rate and review workers</li>
                    </>
                  )}
                  {selectedRole === 'worker' && (
                    <div>
                      <>
                        <li>• Browse available job opportunities</li>
                        <li>• Apply for jobs that match your skills</li>
                        <li>• Showcase your portfolio and experience</li>
                        <li>• Build your professional reputation</li>
                      </>
                      <p className='my-3 font-bold italic'>Please fill in the following additional information:</p>
                      {/* bio */}
                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                          Bio
                        </label>
                        <div className="mt-1 relative">
                          <input
                            id="bio"
                            {...register('bio', { 
                              required: 'Bio is required',
                              minLength: { value: 10, message: 'Bio must be at least 10 characters' }
                            })}
                            type="text"
                            autoComplete="off"
                            className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter your bio"
                          />
                          <LifeBuoy className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                        {errors.bio && (
                          <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
                        )}
                      </div>

                      {/* skills */}
                      <div>
                        <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                          Skills
                        </label>
                        <div className="mt-1 relative">
                          <input
                            id="skills"
                            {...register('skills', { 
                              required: 'Skills are required',
                              minLength: { value: 4, message: 'Skills must be at least 4 characters' }
                            })}
                            type="text"
                            autoComplete="off"
                            className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter your skills"
                          />
                          <Network className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                        {errors.skills && (
                          <p className="mt-1 text-sm text-red-600">{errors.skills.message}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {selectedRole === 'admin' && (
                    <>
                      <li>• Manage all users and accounts</li>
                      <li>• Monitor platform activity</li>
                      <li>• Handle disputes and support</li>
                      <li>• Access analytics and reports</li>
                    </>
                  )}
                </ul>
              </motion.div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-blue-500 hover:text-blue-700">
                  Sign in
                </Link>
              </span>
            </div>
            <div className='text-center mt-2'>
              <span className="text-sm text-gray-600">
                Read the{' '}
                <button onClick={handleShowTerms} className="cursor-pointer font-medium text-blue-500 hover:text-blue-700">
                  Terms and Agreements
                </button>{' '}
                here.
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Popup for Terms */}
      <Terms visible={showTermsPopup} onClose={handleCloseTerms} />
    </div>
  );
}

export default Register;
