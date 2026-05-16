import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiRefreshCw } from 'react-icons/fi'
import { authAPI } from '../../services/apiServices'
import { toast } from 'react-toastify'

const VerifyEmail = () => {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [timer, setTimer] = useState(60)
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || localStorage.getItem('pendingVerificationEmail')

  useEffect(() => {
    if (!email) {
      toast.error('No email found for verification')
      navigate('/register')
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [email, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP')
      return
    }

    setLoading(true)
    try {
      await authAPI.verifyEmail({ email, otp })
      toast.success('Email verified successfully! You can now log in.')
      localStorage.removeItem('pendingVerificationEmail')
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (timer > 0) return

    setResending(true)
    try {
      await authAPI.resendOTP(email, 'verification')
      toast.success('New OTP sent to your email')
      setTimer(60)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary pt-24 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-8 rounded-lg w-full max-w-md text-center"
      >
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center">
            <FiCheckCircle className="text-4xl text-secondary" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-2 gold-text">Verify Email</h1>
        <p className="text-gray-400 mb-8">
          We've sent a 6-digit verification code to <br />
          <span className="text-white font-semibold">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              maxLength="6"
              placeholder="0 0 0 0 0 0"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              required
              className="w-full text-center text-3xl tracking-[10px] py-4 bg-primary border border-secondary rounded focus:outline-none focus:border-yellow-400 font-bold"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full btn-premium py-4 rounded font-bold disabled:opacity-50 text-lg"
          >
            {loading ? 'Verifying...' : 'Verify & Activate'}
          </motion.button>
        </form>

        <div className="mt-8 text-gray-400">
          <p>Didn't receive the code?</p>
          <button
            onClick={handleResend}
            disabled={timer > 0 || resending}
            className={`mt-2 flex items-center justify-center mx-auto space-x-2 ${
              timer > 0 || resending ? 'opacity-50 cursor-not-allowed' : 'text-secondary hover:text-yellow-400'
            }`}
          >
            <FiRefreshCw className={resending ? 'animate-spin' : ''} />
            <span>{timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default VerifyEmail
