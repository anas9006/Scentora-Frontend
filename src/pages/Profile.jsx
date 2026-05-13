import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUser, FiLock, FiPackage, FiEdit2, FiSave, FiX, FiCheckCircle } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { authAPI, orderAPI } from '../services/apiServices'
import { updateUser } from '../redux/authSlice'

const Profile = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState('details')
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const [isEditing, setIsEditing] = useState(false)

  // Profile Form State
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders()
    }
  }, [activeTab])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await orderAPI.getOrders()
      setOrders(res.data.orders)
    } catch (error) {
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
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('Passwords do not match')
    }
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
    { id: 'details', label: 'My Details', icon: <FiUser /> },
    { id: 'security', label: 'Security', icon: <FiLock /> },
    { id: 'orders', label: 'My Orders', icon: <FiPackage /> },
  ]

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 luxury-gradient">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold gold-text gold-glow mb-4">My Account</h1>
          <p className="text-muted text-lg">Manage your personal information and track your fragrance journey.</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:w-1/4">
            <div className="surface-panel rounded-2xl p-4 sticky top-32">
              <div className="flex flex-row lg:flex-col gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-accent text-[#D4AF37] font-bold'
                        : 'hover:bg-white/5 text-muted hover:text-light'
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            <AnimatePresence mode="wait">
              {activeTab === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="surface-panel rounded-3xl p-8"
                >
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-semibold text-light flex items-center gap-2">
                      <FiUser className="text-accent" /> Personal Information
                    </h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 text-accent hover:text-accent-soft transition"
                      >
                        <FiEdit2 /> Edit Profile
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm text-muted uppercase tracking-widest">First Name</label>
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                          className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition ${
                            !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                          }`}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-muted uppercase tracking-widest">Last Name</label>
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                          className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition ${
                            !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                          }`}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-muted uppercase tracking-widest">Email Address</label>
                        <input
                          type="email"
                          disabled={!isEditing}
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition ${
                            !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                          }`}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-muted uppercase tracking-widest">Phone Number</label>
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                          className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition ${
                            !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex gap-4 pt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn-premium px-8 py-3 rounded-xl flex items-center gap-2"
                        >
                          <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false)
                            setProfileData({
                              firstName: user?.firstName || '',
                              lastName: user?.lastName || '',
                              email: user?.email || '',
                              phone: user?.phone || '',
                            })
                          }}
                          className="bg-white/5 hover:bg-white/10 text-light px-8 py-3 rounded-xl flex items-center gap-2 transition"
                        >
                          <FiX /> Cancel
                        </button>
                      </div>
                    )}
                  </form>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="surface-panel rounded-3xl p-8"
                >
                  <h2 className="text-2xl font-semibold text-light flex items-center gap-2 mb-8">
                    <FiLock className="text-accent" /> Password & Security
                  </h2>

                  <form onSubmit={handlePasswordUpdate} className="max-w-md space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm text-muted uppercase tracking-widest">Current Password</label>
                      <input
                        type="password"
                        required
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted uppercase tracking-widest">New Password</label>
                      <input
                        type="password"
                        required
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted uppercase tracking-widest">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-premium w-full py-4 rounded-xl flex items-center justify-center gap-2 mt-4"
                    >
                      <FiCheckCircle /> {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold text-light flex items-center gap-2 mb-4">
                    <FiPackage className="text-accent" /> Order History
                  </h2>

                  {loading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
                    </div>
                  ) : orders.length > 0 ? (
                    orders.map((order) => (
                      <div key={order._id} className="surface-panel rounded-2xl p-6 overflow-hidden">
                        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                          <div>
                            <p className="text-xs text-muted uppercase tracking-widest mb-1">Order ID</p>
                            <p className="text-sm font-mono text-light">#{order._id.toUpperCase()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted uppercase tracking-widest mb-1">Date</p>
                            <p className="text-sm text-light">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted uppercase tracking-widest mb-1">Status</p>
                            <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                              order.orderStatus === 'delivered' ? 'bg-green-500/20 text-green-400' :
                              order.orderStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-accent/20 text-accent'
                            }`}>
                              {order.orderStatus}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs text-muted uppercase tracking-widest mb-1">Total</p>
                            <p className="text-lg font-bold text-accent">Rs. {order.totalAmount.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 border-t border-white/5 pt-4">
                              <div className="w-16 h-16 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={item.product?.images?.[0] || 'https://via.placeholder.com/150'}
                                  alt={item.product?.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-light font-medium">{item.product?.name}</p>
                                <p className="text-sm text-muted">Qty: {item.quantity} × Rs. {item.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="surface-panel rounded-3xl p-12 text-center">
                      <FiPackage size={48} className="text-muted mx-auto mb-4 opacity-20" />
                      <p className="text-muted">You haven't placed any orders yet.</p>
                      <button className="text-accent mt-4 hover:underline">Start Shopping</button>
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
