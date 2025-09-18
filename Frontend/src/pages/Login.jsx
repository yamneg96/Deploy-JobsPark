import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { login, verifyEmail, resendVerification } from '../services/auth';
import { Eye, EyeOff, Mail } from 'lucide-react';
import Terms from '../components/Terms';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { setUser, userEmail } = useAuth();
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  
  const verifiedQuery = query.get('verified') === 'true';
  const alreadyVerifiedQuery = query.get('alreadyVerified') === 'true';
  const failedVerifyQuery = query.get('verified') === 'false';
  const token = query.get('token');

  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const handleShowTerms = () => setShowTermsPopup(!showTermsPopup);

  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await login(data);
      sessionStorage.setItem('user', JSON.stringify(res));
      setUser(res);
      toast.success('Logged in successfully!');

      const role = (res.role || '').toLowerCase();
      if (role === 'client') {
        navigate('/client');
      } else if (role === 'worker') {
        navigate('/worker');
      } else if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      if (err?.response?.status === 403) {
        toast.error('Please verify your email before logging in.');
      } else {
        const msg = err?.response?.data?.message || 'Login failed.';
        toast.error(msg);
      }
      console.error('login error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      const verifyUserEmail = async () => {
        try {
          await verifyEmail(token);
          toast.success('Email verified successfully! You can now log in.');
          navigate('/login?verified=true');
        } catch (err) {
          toast.error('Email verification failed or token expired.');
          navigate('/login?verified=false');
        }
      };
      verifyUserEmail();
    }
  }, [token, navigate]);

  const handleResendVerification = async () => {
    const email = prompt('Please enter the registered email for re-verification')
    if (email) {
      try {
        await resendVerification(email);
        toast.success('Verification email resent! Please check your inbox.');
      } catch (err) {
        toast.error('Failed to resend verification email.');
        console.error(err);
      }
    } else {
      toast.error('No email found. Please log in first.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Verification messages */}
      {verifiedQuery && (
        <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-center font-bold italic">
          ✅ Your email has been verified! Please log in.
        </div>
      )}
      {alreadyVerifiedQuery && (
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md mb-4 text-center">
          ℹ️ Your email was already verified. Please log in.
        </div>
      )}
      {failedVerifyQuery && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">
          ❌ Email verification failed or token expired.
          <button onClick={handleResendVerification} className="cursor-pointer text-blue-600 hover:underline ml-2">
            Resend Verification Email
          </button>
        </div>
      )}

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          {verifiedQuery ? 'Login to your account' : 'Welcome Back'}
        </h2>
        {!verifiedQuery && (
          <p className="text-center italic -mb-3 mt-3 text-xl">Login to continue</p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md mx-5">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 relative">
                <input
                  {...register('email', { required: 'Email is required' })}
                  type="email"
                  className="block w-full px-3 py-2 pl-10 border rounded-md shadow-sm"
                  placeholder="you@example.com"
                  id="email"
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative">
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPassword ? 'text' : 'password'}
                  className="block w-full px-3 py-2 pr-10 border rounded-md shadow-sm"
                  placeholder="Enter your password"
                />
                <button type="button" className="absolute right-3 top-2.5" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 cursor-pointer" /> : <Eye className="h-5 w-5 text-gray-400 cursor-pointer" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">Forgot Password?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-blue-500 hover:text-blue-700">
                  Sign Up
                </Link>
              </span>
            </div>
            <div className="text-center mt-3">
              <span className="text-sm text-gray-600">
                Read the{' '}
                <button onClick={handleShowTerms} className="cursor-pointer font-medium text-blue-500 hover:text-blue-700">
                  terms and Agreements
                </button>{' '}
                here.
              </span>
            </div>
          </div>
        </div>
      </div>

      {showTermsPopup && (
        <Terms className="fixed inset-0 z-50 flex items-center justify-center p-4" />
      )}
    </div>
  );
};

export default Login;