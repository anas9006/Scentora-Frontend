import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  FiUser, FiLock, FiPackage, FiEdit2, FiSave, FiX,
  FiCheckCircle, FiEye, FiEyeOff, FiShield,
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import { authAPI, orderAPI } from '../services/apiServices'
import { updateUser } from '../redux/authSlice'

const getStrength = (pw) => {
  if (!pw) return 0
  let s = 0
  if (pw.length >= 8)          s++
  if (/[A-Z]/.test(pw))        s++
  if (/[0-9]/.test(pw))        s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}
const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
const strengthColor = ['', '#ef4444', '#f97316', '#eab308', '#22c55e']

const PasswordField = ({ label, value, onChange, required }) => {
  const [show, setShow] = useState(false)
  return (
    <div className="space-y-2">
      <label className="text-xs sm:text-sm text-muted uppercase tracking-widest">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          required={required}
          value={value}
          onChange={onChange}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-accent transition text-sm sm:text-base"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-accent transition"
          tabIndex={-1}
        >
          {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
        </button>
      </div>
    </div>
  )
}

const Profile = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch  = useDispatch()
  const [activeTab, setActiveTab] = useState('details')
  const [loading,   setLoading]   = useState(false)
  const [orders,    setOrders]    = useState([])
  const [isEditing, setIsEditing] = useState(false)

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName:  user?.lastName  || '',
    email:     user?.email     || '',
    phone:     user?.phone     || '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  })

  const pwStrength = getStrength(passwordData.newPassword)

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders()
  }, [activeTab])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await orderAPI.getOrders()
      setOrders(res.data.orders)
    } catch {
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await authAPI.updateProfile(profileData)
      dispatch(updateUser(res.data.user))
      toast.success('Profile updated successfully')
      setIsEditing(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword)
      return toast.error('Passwords do not match')
    try {
      setLoading(true)
      await authAPI.updatePassword(passwordData)
      toast.success('Password updated successfully')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password update failed')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'details',  label: 'My Details', icon: <FiUser    size={18} /> },
    { id: 'security', label: 'Security',   icon: <FiShield  size={18} /> },
    { id: 'orders',   label: 'My Orders',  icon: <FiPackage size={18} /> },
  ]

  return (
    <div className="min-h-screen pt-20 sm:pt-28 md:pt-32 pb-16 sm:pb-20 px-3 sm:px-6 lg:px-8 luxury-gradient">
      <div className="max-w-5xl mx-auto">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-7 sm:mb-10 md:mb-12"
        >
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold gold-text gold-glow mb-2 sm:mb-3">
            My Account
          </h1>
          <p className="text-muted text-sm sm:text-base md:text-lg px-2">
            Manage your personal information and track your fragrance journey.
          </p>
        </motion.div>

        {/* Mobile / Tablet Tab Bar */}
        <div className="flex lg:hidden surface-panel rounded-2xl p-1.5 gap-1 mb-5 sm:mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 px-1 sm:px-2 py-2 sm:py-2.5 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-accent text-[#D4AF37]'
                  : 'hover:bg-white/5 text-muted hover:text-light'
              }`}
            >
              <span className="text-base sm:text-lg">{tab.icon}</span>
              {/* Full label on sm+, abbreviated on xs */}
              <span className="text-[10px] sm:text-sm leading-tight">
                {tab.id === 'details'  ? <><span className="sm:hidden">Details</span><span className="hidden sm:inline">My Details</span></> : tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 lg:gap-8">

          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-1/4">
            <div className="surface-panel rounded-2xl p-4 sticky top-32">
              <div className="flex flex-col gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left w-full ${
                      activeTab === tab.id
                        ? 'bg-accent text-[#D4AF37] font-bold'
                        : 'hover:bg-white/5 text-muted hover:text-light'
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">

              {/* Details Tab */}
              {activeTab === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="surface-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8"
                >
                  <div className="flex flex-wrap justify-between items-center gap-3 mb-5 sm:mb-7">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-light flex items-center gap-2">
                      <FiUser className="text-accent" /> Personal Information
                    </h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1.5 text-accent hover:text-accent-soft transition text-sm"
                      >
                        <FiEdit2 size={14} /> Edit
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleProfileUpdate} className="space-y-4 sm:space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      {[
                        { label: 'First Name', key: 'firstName', type: 'text' },
                        { label: 'Last Name',  key: 'lastName',  type: 'text' },
                        { label: 'Email Address', key: 'email',  type: 'email' },
                        { label: 'Phone Number',  key: 'phone',  type: 'tel' },
                      ].map(({ label, key, type }) => (
                        <div key={key} className="space-y-1.5 sm:space-y-2">
                          <label className="text-xs sm:text-sm text-muted uppercase tracking-widest">
                            {label}
                          </label>
                          <input
                            type={type}
                            disabled={!isEditing}
                            value={profileData[key]}
                            onChange={(e) => setProfileData({ ...profileData, [key]: e.target.value })}
                            className={`w-full bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-accent transition ${
                              !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                            }`}
                          />
                        </div>
                      ))}
                    </div>

                    {isEditing && (
                      <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn-premium px-5 sm:px-8 py-2.5 sm:py-3 rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                          <FiSave size={14} /> {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false)
                            setProfileData({
                              firstName: user?.firstName || '',
                              lastName:  user?.lastName  || '',
                              email:     user?.email     || '',
                              phone:     user?.phone     || '',
                            })
                          }}
                          className="bg-white/5 hover:bg-white/10 text-light px-5 sm:px-8 py-2.5 sm:py-3 rounded-xl flex items-center justify-center gap-2 transition text-sm sm:text-base"
                        >
                          <FiX size={14} /> Cancel
                        </button>
                      </div>
                    )}
                  </form>
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="surface-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8"
                >
                  <div className="flex flex-col items-center text-center mb-5 sm:mb-7">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-light flex items-center gap-2 mb-1.5 sm:mb-2">
                      <FiLock className="text-accent" /> Password & Security
                    </h2>
                    <p className="text-muted text-xs sm:text-sm px-2">
                      Use a strong password — at least 8 characters with numbers and symbols.
                    </p>
                  </div>

                  <form onSubmit={handlePasswordUpdate} className="w-full max-w-md mx-auto space-y-4 sm:space-y-5">
                    <PasswordField
                      label="Current Password"
                      required
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    />

                    <div className="space-y-1">
                      <PasswordField
                        label="New Password"
                        required
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      />
                      {passwordData.newPassword.length > 0 && (
                        <div className="pt-1">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4].map((i) => (
                              <div
                                key={i}
                                className="flex-1 h-1 rounded-full transition-all duration-300"
                                style={{
                                  background: i <= pwStrength
                                    ? strengthColor[pwStrength]
                                    : 'rgba(255,255,255,0.08)',
                                }}
                              />
                            ))}
                          </div>
                          <p className="text-xs mt-1" style={{ color: strengthColor[pwStrength] }}>
                            {strengthLabel[pwStrength]}
                          </p>
                        </div>
                      )}
                    </div>

                    <PasswordField
                      label="Confirm New Password"
                      required
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    />

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-premium w-full py-3 sm:py-4 rounded-xl flex items-center justify-center gap-2 mt-2 text-sm sm:text-base"
                    >
                      <FiCheckCircle size={16} /> {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 sm:space-y-5"
                >
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-light flex items-center gap-2 mb-3 sm:mb-4">
                    <FiPackage className="text-accent" /> Order History
                  </h2>

                  {loading ? (
                    <div className="flex justify-center py-12">
                      <LoadingSpinner />
                    </div>
                  ) : orders.length > 0 ? (
                    orders.map((order) => (
                      <div key={order._id} className="surface-panel rounded-xl sm:rounded-2xl overflow-hidden">

                        {/* Meta strip — 2-col on mobile, 4-col on sm+ */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 md:p-6 border-b border-white/5">
                          <div>
                            <p className="text-[10px] sm:text-xs text-muted uppercase tracking-widest mb-0.5 sm:mb-1">
                              Order ID
                            </p>
                            <p className="text-xs sm:text-sm font-mono text-light break-all">
                              #{order._id.slice(-8).toUpperCase()}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] sm:text-xs text-muted uppercase tracking-widest mb-0.5 sm:mb-1">
                              Date
                            </p>
                            <p className="text-xs sm:text-sm text-light">
                              {new Date(order.createdAt).toLocaleDateString('en-PK', {
                                day: '2-digit', month: 'short', year: 'numeric',
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] sm:text-xs text-muted uppercase tracking-widest mb-0.5 sm:mb-1">
                              Status
                            </p>
                            <span className={`text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-bold uppercase ${
                              order.orderStatus === 'delivered' ? 'bg-green-500/20 text-green-400' :
                              order.orderStatus === 'pending'   ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-accent/20 text-accent'
                            }`}>
                              {order.orderStatus}
                            </span>
                          </div>
                          <div>
                            <p className="text-[10px] sm:text-xs text-muted uppercase tracking-widest mb-0.5 sm:mb-1">
                              Total
                            </p>
                            <p className="text-sm sm:text-base md:text-lg font-bold text-accent">
                              Rs. {order.totalAmount.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className={`flex items-center gap-3 sm:gap-4 ${idx > 0 ? 'border-t border-white/5 pt-3 sm:pt-4' : ''}`}
                            >
                              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/150'}
                                  alt={item.product?.name}
                                  loading="lazy"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-light font-medium text-xs sm:text-sm md:text-base truncate">
                                  {item.product?.name}
                                </p>
                                <p className="text-[10px] sm:text-xs md:text-sm text-muted mt-0.5">
                                  Qty: {item.quantity} × Rs. {item.price}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="surface-panel rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 text-center">
                      <FiPackage size={40} className="text-muted mx-auto mb-3 sm:mb-4 opacity-20" />
                      <p className="text-muted text-sm sm:text-base">You haven't placed any orders yet.</p>
                      <button className="text-accent mt-3 sm:mt-4 hover:underline text-sm sm:text-base">
                        Start Shopping
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile