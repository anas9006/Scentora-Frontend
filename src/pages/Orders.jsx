import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPackage, FiChevronRight, FiClock, FiCheckCircle, FiTruck } from 'react-icons/fi'
import { orderAPI } from '../services/apiServices'
import LoadingSpinner from '../components/LoadingSpinner'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getOrders()
      setOrders(res.data.orders)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiClock className="text-yellow-500" />
      case 'delivered': return <FiCheckCircle className="text-green-500" />
      case 'shipped': return <FiTruck className="text-blue-500" />
      default: return <FiPackage className="text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 luxury-gradient">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold gold-text gold-glow mb-4">My Orders</h1>
          <p className="text-muted text-lg">Track your scent acquisitions and fragrance history.</p>
        </motion.div>

        {loading ? (
          <LoadingSpinner />
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/order/${order._id}`}
                  className="surface-panel block p-6 rounded-3xl border border-secondary/10 hover:border-secondary/40 transition-all duration-300"
                >
                  <div className="flex flex-wrap justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-secondary text-2xl">
                        <FiPackage />
                      </div>
                      <div>
                        <p className="text-xs text-muted uppercase tracking-widest mb-1">Order ID</p>
                        <p className="text-sm font-mono text-light">#{order._id.toUpperCase()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-12">
                      <div className="hidden sm:block">
                        <p className="text-xs text-muted uppercase tracking-widest mb-1">Date</p>
                        <p className="text-sm text-light">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted uppercase tracking-widest mb-1">Status</p>
                        <div className="flex items-center gap-2 text-sm uppercase font-bold">
                          {getStatusIcon(order.orderStatus)}
                          <span className={
                            order.orderStatus === 'delivered' ? 'text-green-500' :
                            order.orderStatus === 'pending' ? 'text-yellow-500' :
                            'text-blue-500'
                          }>
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted uppercase tracking-widest mb-1">Total</p>
                        <p className="text-xl font-bold text-accent">Rs. {order.totalAmount.toFixed(2)}</p>
                      </div>
                      <FiChevronRight className="text-secondary text-2xl" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="surface-panel p-20 rounded-[4rem] text-center border border-secondary/10"
          >
            <FiPackage size={64} className="text-muted mx-auto mb-6 opacity-20" />
            <h2 className="text-2xl font-bold text-white mb-4">No acquisitions found.</h2>
            <p className="text-muted mb-8">You haven't started your fragrance journey with us yet.</p>
            <Link to="/shop" className="btn-premium px-10 py-4 rounded-full font-bold inline-block">
              Begin Shopping
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Orders
