import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLock, FiShield, FiRefreshCw } from 'react-icons/fi'
import { authAPI } from '../../services/apiServices'
import { toast } from 'react-toastify'

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    otp: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [timer, setTimer] = useState(60)
  const navigate = useNavigate()
  const email = localStorage.getItem('pendingResetEmail')

  useEffect(() => {
    if (!email) {
      toast.error('Session expired. Please request a new code.')
      navigate('/forgot-password')
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [email, navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await authAPI.resetPassword({
        email,
        otp: formData.otp,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      })
      toast.success('Password reset successfully! You can now log in.')
      localStorage.removeItem('pendingResetEmail')
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (timer > 0) return
    setResending(true)
    try {
      await authAPI.resendOTP(email, 'reset')
      toast.success('New reset code sent to your email')
      setTimer(60)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend code')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary pt-24 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-lg w-full max-w-md"
      >
        <h1 className="text-4xl font-bold mb-2 gold-text text-center">Reset Password</h1>
        <p className="text-gray-400 mb-8 text-center">Enter the code sent to {email} and your new password</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <FiShield className="absolute left-3 top-3 text-secondary" />
              <input
                type="text"
                name="otp"
                maxLength="6"
                placeholder="6-Digit Code"
                value={formData.otp}
                onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '') })}
                required
                className="w-full pl-10 pr-4 py-3 bg-primary border border-secondary rounded focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-secondary" />
              <input
                type="password"
                name="password"
                placeholder="New Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-primary border border-secondary rounded focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-secondary" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-primary border border-secondary rounded focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full btn-premium py-3 rounded font-bold disabled:opacity-50 mt-4"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>Didn't receive the code?</p>
          <button
            onClick={handleResend}
            disabled={timer > 0 || resending}
            className={`mt-1 flex items-center justify-center mx-auto space-x-1 ${
              timer > 0 || resending ? 'opacity-50' : 'text-secondary hover:text-yellow-400'
            }`}
          >
            <FiRefreshCw className={resending ? 'animate-spin' : ''} />
            <span>{timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default ResetPassword
