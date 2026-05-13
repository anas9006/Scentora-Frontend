import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { FiBarChart, FiPackage, FiShoppingCart, FiUsers, FiPlus, FiTrash2, FiEdit, FiLayers, FiLoader } from 'react-icons/fi'
import { categoryAPI, productAPI, orderAPI, authAPI } from '../../services/apiServices'
import { toast } from 'react-toastify'
import CategoryForm from './CategoryForm'
import ProductForm from './ProductForm'

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth)
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
  const [updatingOrderId, setUpdatingOrderId] = useState(null)

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
      value: `$${stats.totalRevenue.toFixed(2)}`,
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
    <div className="min-h-screen bg-primary pt-24 pb-20">
      <div className="bg-black border-b border-secondary/20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold gold-text gold-glow">Admin Sanctum</h1>
              <p className="text-muted mt-2">Overseeing the fragrance empire.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-4 border-b border-white/5">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide w-full md:w-auto">
            {['dashboard', 'categories', 'products', 'orders', 'customers'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 capitalize flex-shrink-0 ${activeTab === tab
                    ? 'bg-secondary text-primary shadow-lg shadow-secondary/20'
                    : 'bg-white/5 text-muted hover:bg-white/10 hover:text-light'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex gap-4 flex-shrink-0">
            {activeTab === 'categories' && (
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="flex items-center gap-2 bg-white/5 border border-secondary/30 px-6 py-2 rounded-lg hover:bg-white/10 transition"
              >
                <FiPlus /> Category
              </button>
            )}
            {activeTab === 'products' && (
              <button
                onClick={() => setIsProductModalOpen(true)}
                className="btn-premium px-6 py-2 rounded-lg flex items-center gap-2"
              >
                <FiPlus /> New Product
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statCards.map((card, index) => {
                  const Icon = card.icon
                  return (
                    <div key={index} className="surface-panel p-6 rounded-2xl border border-white/5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-muted text-sm uppercase tracking-widest mb-1">{card.title}</p>
                          <p className="text-3xl font-bold text-light">{card.value}</p>
                        </div>
                        <div className={`p-4 rounded-xl bg-white/5 ${card.color}`}>
                          <Icon size={24} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="surface-panel p-8 rounded-3xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <FiBarChart className="text-secondary" /> Sales Intelligence
                </h2>
                <div className="h-64 flex items-center justify-center border border-dashed border-white/10 rounded-2xl">
                  <p className="text-muted italic">Advanced analytics visualization would be integrated here.</p>
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {categories.map((cat) => (
                <div key={cat._id} className="surface-panel p-6 rounded-2xl group hover:border-secondary/30 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
                      <FiLayers size={24} />
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:text-secondary"><FiEdit /></button>
                      <button onClick={() => handleDeleteCategory(cat._id)} className="p-2 hover:text-red-500"><FiTrash2 /></button>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-light mb-2">{cat.name}</h3>
                  <p className="text-muted text-sm line-clamp-2">{cat.description || 'No description provided.'}</p>
                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-muted">
                    <span>{cat.products?.length || 0} Products</span>
                    <span className="uppercase tracking-tighter">Slug: {cat.slug}</span>
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
              className="surface-panel rounded-3xl overflow-hidden"
            >
              <div className="overflow-x-auto">
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
                          <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-gray-400 hover:text-secondary"><FiEdit /></button>
                            <button onClick={() => handleDeleteProduct(prod._id)} className="text-gray-400 hover:text-red-500"><FiTrash2 /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="surface-panel rounded-3xl overflow-hidden"
            >
              <div className="overflow-x-auto">
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
                    {orders.map((order) => (
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
                          ${order.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={order.orderStatus}
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              disabled={updatingOrderId === order._id}
                              className={`bg-black border border-white/10 rounded-lg px-3 py-1 text-xs font-bold uppercase focus:outline-none focus:border-secondary ${order.orderStatus === 'delivered' ? 'text-green-400' :
                                  order.orderStatus === 'pending' ? 'text-yellow-400' :
                                    'text-blue-400'
                                } ${updatingOrderId === order._id ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                            onClick={() => window.open(`/order/${order._id}`, '_blank')}
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
            </motion.div>
          )}

          {activeTab === 'customers' && (
            <motion.div
              key="customers"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="surface-panel rounded-3xl overflow-hidden"
            >
              <div className="overflow-x-auto">
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
                              {u.firstName[0]}{u.lastName[0]}
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
                          <button className="text-gray-400 hover:text-secondary"><FiEdit /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <CategoryForm
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={fetchCategories}
      />
      <ProductForm
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSuccess={() => { fetchProducts(); fetchStats(); }}
      />
    </div>
  )
}

export default AdminDashboard
