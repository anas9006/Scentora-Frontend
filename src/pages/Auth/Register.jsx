import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiLock } from 'react-icons/fi'
import { authAPI } from '../../services/apiServices'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../../redux/authSlice'
import { toast } from 'react-toastify'
import { validateEmail, validatePassword, validateName } from '../../utils/helpers'

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    // Validate first name
    const firstNameValidation = validateName(formData.firstName)
    if (!firstNameValidation.valid) {
      newErrors.firstName = firstNameValidation.error
    }

    // Validate last name
    const lastNameValidation = validateName(formData.lastName)
    if (!lastNameValidation.valid) {
      newErrors.lastName = lastNameValidation.error
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Validate password
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    } else {
      const passwordValidation = validatePassword(formData.password)
      if (!passwordValidation.valid) {
        newErrors.password = passwordValidation.error
      }
    }

    // Validate confirm password
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
      const response = await authAPI.register(formData)
      toast.success(response.data.message)
      localStorage.setItem('pendingVerificationEmail', formData.email)
      navigate('/verify-email', { state: { email: formData.email } })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
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
        <h1 className="text-4xl font-bold mb-2 gold-text">Join Scentora</h1>
        <p className="text-gray-400 mb-8">Create your luxury fragrance account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-secondary" />
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className={`w-full pl-10 pr-4 py-3 bg-primary border rounded focus:outline-none focus:border-yellow-400 ${
                    errors.firstName ? 'border-red-500' : 'border-secondary'
                  }`}
                />
              </div>
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-secondary" />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className={`w-full pl-10 pr-4 py-3 bg-primary border rounded focus:outline-none focus:border-yellow-400 ${
                    errors.lastName ? 'border-red-500' : 'border-secondary'
                  }`}
                />
              </div>
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>
          </div>

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
            <p className="text-gray-500 text-xs mt-1">
              Password must be 8+ characters with uppercase, lowercase, number & special character
            </p>
          </div>

          <div>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-secondary" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`w-full pl-10 pr-4 py-3 bg-primary border rounded focus:outline-none focus:border-yellow-400 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-secondary'
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            type="submit"
            disabled={loading}
            className="w-full btn-premium py-3 rounded font-bold disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </motion.button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-secondary hover:text-yellow-400">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Register
