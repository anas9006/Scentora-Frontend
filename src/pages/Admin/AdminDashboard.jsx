import React, { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { FiBarChart, FiPackage, FiShoppingCart, FiUsers, FiPlus, FiTrash2, FiEdit, FiLayers, FiLoader } from 'react-icons/fi'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { categoryAPI, productAPI, orderAPI, authAPI } from '../../services/apiServices'
import { toast } from 'react-toastify'
import CategoryForm from './CategoryForm'
import ProductForm from './ProductForm'

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  // Modal States
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [updatingOrderId, setUpdatingOrderId] = useState(null)
  const [orderFilter, setOrderFilter] = useState('all')

  // Data States
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [allUsers, setAllUsers] = useState([])

  useEffect(() => {
    if (!user || user.role !== 'admin') return
    fetchStats()
    fetchCategories()
    fetchProducts()
    fetchOrders()
    fetchCustomers()
  }, [user])

  const fetchStats = async () => {
    try {
      const response = await orderAPI.getAllOrders()
      const allOrders = response.data.orders || []
      const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0)

      const productRes = await productAPI.getAllProducts()
      const totalProducts = productRes.data.pagination.total

      const customerRes = await authAPI.getAllCustomers()
      const totalCustomers = customerRes.data.users.length

      setStats({
        totalOrders: allOrders.length,
        totalRevenue,
        totalProducts,
        totalCustomers,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getAllCategories()
      setCategories(res.data.categories)
    } catch (error) {
      toast.error('Failed to load categories')
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await productAPI.getAllProducts({ limit: 50 })
      setProducts(res.data.products)
    } catch (error) {
      toast.error('Failed to load products')
    }
  }

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getAllOrders()
      setOrders(res.data.orders)
    } catch (error) {
      toast.error('Failed to load orders')
    }
  }

  const fetchCustomers = async () => {
    try {
      const res = await authAPI.getAllUsers()
      setAllUsers(res.data.users)
    } catch (error) {
      toast.error('Failed to load customers')
    }
  }

  const handleUpdateOrderStatus = async (orderId, status) => {
    setUpdatingOrderId(orderId)
    try {
      await orderAPI.updateOrderStatus(orderId, { orderStatus: status })
      toast.success(`Order status updated to ${status}`)
      await fetchOrders()
      await fetchStats()
    } catch (error) {
      toast.error('Failed to update status')
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure? This will affect products in this category.')) return
    try {
      await categoryAPI.deleteCategory(id)
      toast.success('Category deleted')
      fetchCategories()
    } catch (error) {
      toast.error('Delete failed')
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return
    try {
      await productAPI.deleteProduct(id)
      toast.success('Product removed')
      fetchProducts()
    } catch (error) {
      toast.error('Delete failed')
    }
  }

  const handleOpenCategoryModal = (category = null) => {
    setSelectedCategory(category)
    setIsCategoryModalOpen(true)
  }

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false)
    setSelectedCategory(null)
  }

  const handleOpenProductModal = (product = null) => {
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false)
    setSelectedProduct(null)
  }

  const orderStatuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']

  const filteredOrders = useMemo(() => {
    return [...orders]
      .filter((order) => orderFilter === 'all' || order.orderStatus === orderFilter)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [orders, orderFilter])

  const getOrderStatusClass = (status) => {
    if (status === 'delivered') return 'text-green-400'
    if (status === 'pending') return 'text-yellow-400'
    if (status === 'cancelled') return 'text-red-400'
    return 'text-blue-400'
  }

  const formatCurrency = (amount) => `Rs${Number(amount || 0).toFixed(2)}`

  // Chart Data
  const revenueData = useMemo(() => {
    const data = {}
    orders.forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString()
      data[date] = (data[date] || 0) + order.totalAmount
    })
    return Object.entries(data).slice(-7).map(([date, amount]) => ({
      date,
      revenue: parseFloat(amount.toFixed(2)),
    }))
  }, [orders])

  const orderStatusData = useMemo(() => {
    const statusCounts = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    }
    orders.forEach((order) => {
      statusCounts[order.orderStatus] = (statusCounts[order.orderStatus] || 0) + 1
    })
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    }))
  }, [orders])

  const COLORS = ['#d4af37', '#2563eb', '#10b981', '#ef4444', '#f59e0b']

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  const statCards = [
    {
      icon: FiShoppingCart,
      title: 'Total Orders',
      value: stats.totalOrders,
      color: 'text-blue-500',
    },
    {
      icon: FiBarChart,
      title: 'Total Revenue',
      value: `Rs${stats.totalRevenue.toFixed(2)}`,
      color: 'text-green-500',
    },
    {
      icon: FiPackage,
      title: 'Total Products',
      value: stats.totalProducts,
      color: 'text-yellow-500',
    },
    {
      icon: FiUsers,
      title: 'Total Customers',
      value: stats.totalCustomers,
      color: 'text-purple-500',
    },
  ]

  return (
    <div className="min-h-screen bg-primary pt-20 md:pt-24 pb-12 md:pb-20">
      <div className="bg-black border-b border-secondary/20">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold gold-text gold-glow">Admin Sanctum</h1>
              <p className="text-muted mt-1 md:mt-2 text-xs md:text-sm">Overseeing the fragrance empire.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 md:px-4 py-6 md:py-12">
        <div className="flex flex-col gap-4 mb-8 md:mb-10 pb-4 border-b border-white/5">
          <div className="flex gap-2 md:gap-4 overflow-x-auto scrollbar-hide w-full">
            {['dashboard', 'categories', 'products', 'orders', 'customers'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 md:px-8 py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-bold transition-all duration-300 capitalize flex-shrink-0 whitespace-nowrap ${activeTab === tab
                    ? 'bg-secondary text-primary shadow-lg shadow-secondary/20'
                    : 'bg-white/5 text-muted hover:bg-white/10 hover:text-light'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2 md:gap-4 flex-shrink-0 w-full md:w-auto">
            {activeTab === 'categories' && (
              <button
                onClick={() => handleOpenCategoryModal()}
                className="flex-1 md:flex-none items-center justify-center gap-2 bg-white/5 border border-secondary/30 px-3 md:px-6 py-2 md:py-2 rounded-lg text-xs md:text-sm hover:bg-white/10 transition inline-flex"
              >
                <FiPlus size={16} /> <span className="hidden sm:inline">Category</span>
              </button>
            )}
            {activeTab === 'products' && (
              <button
                onClick={() => handleOpenProductModal()}
                className="flex-1 md:flex-none btn-premium px-3 md:px-6 py-2 md:py-2 rounded-lg text-xs md:text-sm flex items-center justify-center gap-2"
              >
                <FiPlus size={16} /> <span className="hidden sm:inline">New Product</span>
              </button>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
                {statCards.map((card, index) => {
                  const Icon = card.icon
                  return (
                    <div key={index} className="surface-panel p-3 md:p-6 rounded-lg md:rounded-2xl border border-white/5">
                      <div className="flex items-center justify-between gap-2 md:gap-4">
                        <div>
                          <p className="text-muted text-xs md:text-sm uppercase tracking-widest mb-1">{card.title}</p>
                          <p className="text-xl md:text-3xl font-bold text-light">{card.value}</p>
                        </div>
                        <div className={`p-2 md:p-4 rounded-lg md:rounded-xl bg-white/5 ${card.color}`}>
                          <Icon size={18} className="md:w-6 md:h-6" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="surface-panel p-4 md:p-8 rounded-2xl md:rounded-3xl">
                <h2 className="text-lg md:text-2xl font-bold mb-6 md:mb-8 flex items-center gap-3">
                  <FiBarChart className="text-secondary" /> Sales Intelligence
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Revenue Trend Chart */}
                  <div className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6">
                    <h3 className="text-sm font-bold text-light mb-4">Revenue Trend (Last 7 Days)</h3>
                    {revenueData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={revenueData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                          <XAxis dataKey="date" stroke="rgba(255, 255, 255, 0.6)" tick={{ fontSize: 12 }} />
                          <YAxis stroke="rgba(255, 255, 255, 0.6)" tick={{ fontSize: 12 }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.95)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '8px' }}
                            labelStyle={{ color: '#d4af37' }}
                          />
                          <Line type="monotone" dataKey="revenue" stroke="#d4af37" dot={{ fill: '#d4af37' }} strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-52 flex items-center justify-center border border-dashed border-white/20 rounded-lg">
                        <p className="text-muted italic text-xs">No data available</p>
                      </div>
                    )}
                  </div>

                  {/* Orders by Status Chart */}
                  <div className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6">
                    <h3 className="text-sm font-bold text-light mb-4">Orders by Status</h3>
                    {orderStatusData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={orderStatusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}`}
                            outerRadius={60}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {orderStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.95)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '8px' }}
                            labelStyle={{ color: '#d4af37' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-52 flex items-center justify-center border border-dashed border-white/20 rounded-lg">
                        <p className="text-muted italic text-xs">No data available</p>
                      </div>
                    )}
                  </div>

                  {/* Performance Metrics */}
                  <div className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6">
                    <h3 className="text-sm font-bold text-light mb-4">Key Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs md:text-sm">
                        <span className="text-muted">Avg Order Value</span>
                        <span className="text-secondary font-bold">Rs{stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0.00'}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs md:text-sm">
                        <span className="text-muted">Conversion Rate</span>
                        <span className="text-green-400 font-bold">85%</span>
                      </div>
                      <div className="flex justify-between items-center text-xs md:text-sm">
                        <span className="text-muted">Repeat Customers</span>
                        <span className="text-blue-400 font-bold">42%</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6">
                    <h3 className="text-sm font-bold text-light mb-4">Recent Activity</h3>
                    <div className="space-y-3 text-xs md:text-sm">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <span className="text-muted">New Orders</span>
                        <span className="text-light font-bold">{filteredOrders.length}</span>
                      </div>
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <span className="text-muted">Total Customers</span>
                        <span className="text-light font-bold">{stats.totalCustomers}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted">Active Products</span>
                        <span className="text-light font-bold">{stats.totalProducts}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6"
            >
              {categories.map((cat) => (
                <div key={cat._id} className="surface-panel p-4 md:p-6 rounded-lg md:rounded-2xl group hover:border-secondary/30 transition-all duration-300">
                  <div className="flex justify-between items-start mb-3 md:mb-4">
                    <div className="p-2 md:p-3 bg-secondary/10 rounded-lg md:rounded-xl text-secondary">
                      <FiLayers size={18} className="md:w-6 md:h-6" />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenCategoryModal(cat)}
                        title="Edit category"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-secondary/20 bg-white/5 text-gray-300 hover:text-secondary hover:border-secondary/50 transition"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat._id)}
                        title="Delete category"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:text-red-500 hover:border-red-500/40 transition"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-base md:text-xl font-bold text-light mb-2">{cat.name}</h3>
                  <p className="text-muted text-xs md:text-sm line-clamp-2">{cat.description || 'No description provided.'}</p>
                  <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-white/5 flex justify-between items-center text-xs text-muted">
                    <span>{cat.products?.length || 0} Products</span>
                    <span className="uppercase tracking-tighter truncate ml-2">Slug: {cat.slug}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="surface-panel rounded-2xl md:rounded-3xl overflow-hidden"
            >
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-muted uppercase text-xs tracking-widest">
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">House</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.map((prod) => (
                      <tr key={prod._id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden">
                              <img src={prod.images?.[0]?.url || '/placeholder-perfume.jpg'} alt="" className="w-full h-full object-cover" />
                            </div>
                            <span className="font-medium text-light">{prod.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted">{prod.brand}</td>
                        <td className="px-6 py-4">
                          <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold uppercase">
                            {prod.category?.name || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-light font-bold">${prod.price}</td>
                        <td className="px-6 py-4">
                          <span className={prod.stock < 10 ? 'text-red-400 font-bold' : 'text-green-400'}>
                            {prod.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenProductModal(prod)}
                              title="Edit product"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-secondary/20 bg-white/5 text-gray-300 hover:text-secondary hover:border-secondary/50 transition"
                            >
                              <FiEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod._id)}
                              title="Delete product"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:text-red-500 hover:border-red-500/40 transition"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="lg:hidden divide-y divide-white/5">
                {products.map((prod) => (
                  <div key={prod._id} className="p-4">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
                        <img src={prod.images?.[0]?.url || '/placeholder-perfume.jpg'} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="text-light font-bold text-sm truncate">{prod.name}</h3>
                            <p className="text-muted text-xs truncate">{prod.brand}</p>
                          </div>
                          <span className="text-light font-bold text-sm whitespace-nowrap">Rs.{prod.price}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                          <span className="bg-secondary/10 text-secondary px-2.5 py-1 rounded-full font-bold uppercase">
                            {prod.category?.name || 'N/A'}
                          </span>
                          <span className={prod.stock < 10 ? 'text-red-400 font-bold' : 'text-green-400'}>
                            Stock {prod.stock}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleOpenProductModal(prod)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-secondary/25 bg-white/5 px-3 py-2 text-xs font-bold text-secondary"
                      >
                        <FiEdit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod._id)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400"
                      >
                        <FiTrash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="surface-panel rounded-2xl md:rounded-3xl overflow-hidden"
            >
              <div className="p-4 md:p-5 border-b border-white/5">
                <div className="flex flex-row items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-light">Orders</h2>
                    <p className="text-xs text-muted mt-1">Latest orders appear first.</p>
                  </div>
                  
                  {/* Mobile Dropdown */}
                  <div className="md:hidden w-40">
                    <select
                      value={orderFilter}
                      onChange={(e) => setOrderFilter(e.target.value)}
                      className="w-full bg-black border border-secondary/30 rounded-lg px-3 py-2 text-xs font-bold uppercase text-secondary focus:outline-none focus:border-secondary"
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Desktop Buttons */}
                <div className="hidden md:flex gap-2 overflow-x-auto pb-1 mt-4">
                  {orderStatuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => setOrderFilter(status)}
                      className={`flex-shrink-0 rounded-lg px-3 py-2 text-xs font-bold uppercase transition ${orderFilter === status
                          ? 'bg-secondary text-primary'
                          : 'bg-white/5 text-muted hover:bg-white/10 hover:text-light'
                        }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-muted uppercase text-xs tracking-widest">
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-6 py-10 text-center text-sm text-muted">
                          No orders found for this status.
                        </td>
                      </tr>
                    )}
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-secondary">
                          #{order._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-light font-bold">{order.user?.firstName} {order.user?.lastName}</span>
                            <span className="text-xs text-muted">{order.user?.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-light font-bold">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={order.orderStatus}
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              disabled={updatingOrderId === order._id}
                              className={`bg-black border border-white/10 rounded-lg px-3 py-1 text-xs font-bold uppercase focus:outline-none focus:border-secondary ${getOrderStatusClass(order.orderStatus)} ${updatingOrderId === order._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            {updatingOrderId === order._id && (
                              <FiLoader className="animate-spin text-secondary" size={16} />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => navigate(`/order/${order._id}`)}
                            className="text-xs text-secondary hover:underline"
                          >
                            View Invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="lg:hidden divide-y divide-white/5 space-y-3">
                {filteredOrders.length === 0 && (
                  <div className="p-6 text-center text-sm text-muted">
                    No orders found for this status.
                  </div>
                )}
                {filteredOrders.map((order) => (
                  <div key={order._id} className="p-4 rounded-3xl bg-white/5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-mono text-xs text-secondary">#{order._id.slice(-8).toUpperCase()}</p>
                        <h3 className="mt-1 text-sm font-bold text-light truncate">
                          {order.user?.firstName} {order.user?.lastName}
                        </h3>
                        <p className="text-xs text-muted truncate">{order.user?.email || 'No email available'}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-light">{formatCurrency(order.totalAmount)}</p>
                        <p className="text-xs text-muted mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 sm:items-center">
                      <div className="flex items-center gap-2">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          disabled={updatingOrderId === order._id}
                          className={`w-full sm:w-auto bg-black border border-white/10 rounded-lg px-3 py-2 text-xs font-bold uppercase focus:outline-none focus:border-secondary ${getOrderStatusClass(order.orderStatus)} ${updatingOrderId === order._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        {updatingOrderId === order._id && (
                          <FiLoader className="animate-spin text-secondary flex-shrink-0" size={16} />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate(`/order/${order._id}`)}
                        className="rounded-lg border border-secondary/25 bg-white/5 px-3 py-2 text-xs font-bold text-secondary"
                      >
                        View Invoice
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'customers' && (
            <motion.div
              key="customers"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="surface-panel rounded-2xl md:rounded-3xl overflow-hidden"
            >
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-muted uppercase text-xs tracking-widest">
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Joined Date</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Email Verified</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {allUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold">
                              {u.firstName?.[0]}{u.lastName?.[0]}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-light font-bold">{u.firstName} {u.lastName}</span>
                              <span className="text-xs text-muted">{u.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted text-sm">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
                            }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={u.isEmailVerified ? 'text-green-400' : 'text-gray-500'}>
                            {u.isEmailVerified ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            title="Edit customer"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-secondary/20 bg-white/5 text-gray-300 hover:text-secondary hover:border-secondary/50 transition"
                          >
                            <FiEdit />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="lg:hidden divide-y divide-white/5 space-y-3">
                {allUsers.map((u) => (
                  <div key={u._id} className="p-4 rounded-3xl bg-white/5">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-full bg-secondary/20 flex flex-shrink-0 items-center justify-center text-secondary font-bold">
                        {u.firstName?.[0]}{u.lastName?.[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="text-light font-bold text-sm truncate">{u.firstName} {u.lastName}</h3>
                            <p className="text-muted text-xs truncate">{u.email}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
                            }`}>
                            {u.role}
                          </span>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <div className="rounded-lg bg-white/5 border border-white/5 p-2">
                            <p className="text-muted">Joined</p>
                            <p className="text-light font-semibold">{new Date(u.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="rounded-lg bg-white/5 border border-white/5 p-2">
                            <p className="text-muted">Verified</p>
                            <p className={u.isEmailVerified ? 'text-green-400 font-semibold' : 'text-gray-500 font-semibold'}>
                              {u.isEmailVerified ? 'Yes' : 'No'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <CategoryForm
        isOpen={isCategoryModalOpen}
        onClose={handleCloseCategoryModal}
        onSuccess={fetchCategories}
        category={selectedCategory}
      />
      <ProductForm
        isOpen={isProductModalOpen}
        onClose={handleCloseProductModal}
        onSuccess={() => { fetchProducts(); fetchStats(); }}
        product={selectedProduct}
      />
    </div>
  )
}

export default AdminDashboard
