import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock } from 'react-icons/fi'
import { authAPI } from '../../services/apiServices'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../../redux/authSlice'
import { toast } from 'react-toastify'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authAPI.login(formData)
      dispatch(loginSuccess(response.data))
      toast.success('Logged in successfully!')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
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
          <div className="relative">
            <FiMail className="absolute left-3 top-3 text-secondary" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 bg-primary border border-secondary rounded focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-3 text-secondary" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 bg-primary border border-secondary rounded focus:outline-none focus:border-yellow-400"
            />
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
