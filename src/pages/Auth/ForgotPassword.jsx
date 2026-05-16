import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiArrowLeft } from 'react-icons/fi'
import { authAPI } from '../../services/apiServices'
import { toast } from 'react-toastify'
import { validateEmail } from '../../utils/helpers'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.forgotPassword(email)
      toast.success(response.data.message || 'OTP sent successfully')
      localStorage.setItem('pendingResetEmail', email)
      navigate('/reset-password')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary pt-24 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-lg w-full max-w-md"
      >
        <Link to="/login" className="flex items-center text-secondary hover:text-yellow-400 mb-6 text-sm">
          <FiArrowLeft className="mr-2" /> Back to Login
        </Link>
        
        <h1 className="text-4xl font-bold mb-2 gold-text">Forgot Password</h1>
        <p className="text-gray-400 mb-8">Enter your email to receive a password reset code</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FiMail className="absolute left-3 top-3 text-secondary" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 bg-primary border border-secondary rounded focus:outline-none focus:border-yellow-400"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full btn-premium py-3 rounded font-bold disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Code'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}

export default ForgotPassword
