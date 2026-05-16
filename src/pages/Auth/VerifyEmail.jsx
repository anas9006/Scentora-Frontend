import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiRefreshCw, FiArrowLeft } from 'react-icons/fi'
import { authAPI } from '../../services/apiServices'
import { toast } from 'react-toastify'

const VerifyEmail = () => {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [timer, setTimer] = useState(60)
  
  const navigate = useNavigate()
  const location = useLocation()
  const inputRef = useRef(null)

  const email = location.state?.email || localStorage.getItem('pendingVerificationEmail')

  useEffect(() => {
    if (!email) {
      toast.error('No email found for verification')
      navigate('/register', { replace: true })
    }
  }, [email, navigate])

  useEffect(() => {
    if (!email || timer === 0) return

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [email, timer])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  if (!email) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP')
      return
    }

    setLoading(true)
    try {
      await authAPI.verifyEmail({ email, otp })
      toast.success('Email verified successfully!')
      localStorage.removeItem('pendingVerificationEmail')
      navigate('/login', { replace: true })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (timer > 0 || resending) return

    setResending(true)
    try {
      await authAPI.resendOTP(email, 'verification')
      toast.success('New code sent successfully')
      setTimer(60)
      setOtp('')
      if (inputRef.current) inputRef.current.focus()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend code')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center px-4 py-6 md:py-12">
      
      {/* Compact Header Navigation Wrapper */}
      <div className="w-full max-w-sm sm:max-w-md mb-4 flex justify-start">
        <button
          onClick={() => navigate('/register')}
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 text-xs sm:text-sm font-medium group"
        >
          <FiArrowLeft className="text-sm group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Registration</span>
        </button>
      </div>

      {/* Main Verification Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="glass p-6 sm:p-8 rounded-xl w-full max-w-sm sm:max-w-md text-center border border-white/10 shadow-2xl backdrop-blur-md"
      >
        {/* Status Badge */}
        <div className="mb-4 sm:mb-6 flex justify-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary/10 border border-secondary/20 rounded-full flex items-center justify-center">
            <FiCheckCircle className="text-2xl sm:text-3xl text-secondary" />
          </div>
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 gold-text tracking-tight">Verify Your Email</h1>
        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8 max-w-xs mx-auto">
          We've sent a 6-digit confirmation code to <br />
          <span className="text-white font-medium break-all underline decoration-secondary/30 underline-offset-4">{email}</span>
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              maxLength="6"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              required
              disabled={loading}
              // Notice how the tracking spacing falls back to 8px on smaller mobile cards to prevent text clipped overflow
              className="w-full text-center text-2xl sm:text-3xl tracking-[8px] sm:tracking-[12px] pl-[8px] sm:pl-[12px] py-3 sm:py-4 bg-primary/40 border border-white/10 rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 font-mono font-bold transition-all duration-150"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full btn-premium py-3 sm:py-4 rounded-lg font-bold disabled:opacity-40 disabled:cursor-not-allowed text-sm sm:text-base transition-all shadow-md"
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <FiRefreshCw className="animate-spin text-sm" />
                <span>Validating...</span>
              </span>
            ) : (
              'Verify & Activate'
            )}
          </motion.button>
        </form>

        {/* Footer Actions */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-white/5 text-xs sm:text-sm text-gray-400">
          <p>Didn't receive the code?</p>
          <button
            onClick={handleResend}
            type="button"
            disabled={timer > 0 || resending}
            className={`mt-1.5 inline-flex items-center justify-center space-x-2 font-medium transition-all duration-200 ${
              timer > 0 || resending 
                ? 'text-gray-500 cursor-not-allowed' 
                : 'text-secondary hover:text-yellow-400 cursor-pointer'
            }`}
          >
            <FiRefreshCw className={`${resending ? 'animate-spin' : ''} text-xs`} />
            <span>{timer > 0 ? `Resend code in ${timer}s` : 'Resend OTP'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default VerifyEmail