import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import axios from '../services/axios'
import { toast } from 'react-hot-toast'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateEmail(email)) return toast.error('Please enter a valid email.')

    try {
      setLoading(true)
      const res = await axios.post('/users/forgot-password', { email })
      toast.success(res.data.message || 'Reset link sent to your email.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex flex-col justify-center items-center px-4'>
      <Link to='/login' className='text-blue-500 hover:text-blue-700 text-sm flex items-center mb-4'>
        <ArrowLeft className='inline mr-2' /> Go Back
      </Link>

      <h1 className='text-3xl font-bold mb-4'>Forgot Password</h1>

      <form onSubmit={handleSubmit} className='w-full max-w-md space-y-4'>
        <input
          type='email'
          placeholder='Enter your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full border rounded p-2'
        />

        <button
          type='submit'
          className='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full cursor-pointer transition-colors'
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  )
}

export default ForgotPassword
