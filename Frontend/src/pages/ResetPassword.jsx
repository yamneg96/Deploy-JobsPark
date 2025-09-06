import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { resetPassword } from '../services/auth';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }

    try {
      setLoading(true);
      const res = await resetPassword(token, newPassword);
      alert(res.message || 'Password reset successful!');
      navigate('/login');
    } catch (err) {
      console.error('Reset failed:', err);
      alert(err.response?.data?.message || 'Reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col justify-center items-center px-4'>
      <Link
        to='/forgot-password'
        className='text-blue-500 hover:text-blue-700 text-sm flex items-center mb-4'
      >
        <ArrowLeft className='inline mr-2' /> Go Back
      </Link>

      <h1 className='text-3xl font-bold mb-4'>Reset Your Password</h1>

      <form onSubmit={handleReset} className='w-full max-w-md space-y-4'>
        
        <input
          type='password'
          placeholder='Enter new password'
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className='w-full border rounded p-2'
        />
        <input
          type='password'
          placeholder='Confirm new password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className='w-full border rounded p-2'
        />
        <button
          type='submit'
          className='bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 w-full'
          disabled={loading}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;