import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock } from 'react-icons/fi'
import { authAPI } from '../../services/apiServices'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../../redux/authSlice'
import { toast } from 'react-toastify'
import { validateEmail, validatePassword } from '../../utils/helpers'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await authAPI.login(formData)
      dispatch(loginSuccess(response.data))
      toast.success('Logged in successfully!')
      navigate('/')
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed'
      toast.error(errorMessage)
      
      if (errorMessage.toLowerCase().includes('verify')) {
        localStorage.setItem('pendingVerificationEmail', formData.email)
        navigate('/verify-email', { state: { email: formData.email } })
      }
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
        <h1 className="text-4xl font-bold mb-2 gold-text">Welcome Back</h1>
        <p className="text-gray-400 mb-8">Log in to your Scentora account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-secondary" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full pl-10 pr-4 py-3 bg-primary border rounded focus:outline-none focus:border-yellow-400 ${
                  errors.email ? 'border-red-500' : 'border-secondary'
                }`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-secondary" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full pl-10 pr-4 py-3 bg-primary border rounded focus:outline-none focus:border-yellow-400 ${
                  errors.password ? 'border-red-500' : 'border-secondary'
                }`}
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <Link to="/forgot-password" className="text-secondary hover:text-yellow-400 text-sm">
            Forgot password?
          </Link>

          <motion.button
            whileHover={{ scale: 1.05 }}
            type="submit"
            disabled={loading}
            className="w-full btn-premium py-3 rounded font-bold disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-secondary hover:text-yellow-400">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Login
