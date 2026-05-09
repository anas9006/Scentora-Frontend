import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPackage, FiMapPin, FiCreditCard, FiArrowLeft, FiClock, FiCheckCircle, FiTruck } from 'react-icons/fi'
import { orderAPI } from '../services/apiServices'
import LoadingSpinner from '../components/LoadingSpinner'

const OrderDetails = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrderDetails()
  }, [id])

  const fetchOrderDetails = async () => {
    try {
      const res = await orderAPI.getOrderById(id)
      setOrder(res.data.order)
    } catch (error) {
      console.error('Error fetching order details:', error)
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

  if (loading) return <div className="min-h-screen pt-32"><LoadingSpinner /></div>
  if (!order) return <div className="min-h-screen pt-32 text-center">Order not found.</div>

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 luxury-gradient">
      <div className="max-w-6xl mx-auto">
        <Link to="/order" className="inline-flex items-center gap-2 text-secondary hover:text-white transition mb-10 group">
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Acquisitions
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3 space-y-8">
            {/* Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="surface-panel p-8 rounded-[3rem] border border-secondary/10"
            >
              <div className="flex flex-wrap justify-between items-start gap-6 mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Acquisition Details</h1>
                  <p className="text-sm font-mono text-muted">ID: #{order._id.toUpperCase()}</p>
                </div>
                <div className={`px-6 py-2 rounded-full font-bold uppercase text-xs flex items-center gap-2 ${
                  order.orderStatus === 'delivered' ? 'bg-green-500/10 text-green-400' :
                  order.orderStatus === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                  'bg-blue-500/10 text-blue-400'
                }`}>
                  {getStatusIcon(order.orderStatus)}
                  {order.orderStatus}
                </div>
              </div>

              <div className="space-y-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-secondary/20 transition">
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-primary">
                      <img
                        src={item.product?.images?.[0]?.url || '/placeholder-perfume.jpg'}
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-light">{item.product?.name}</h3>
                      <p className="text-sm text-muted mb-2">{item.product?.brand}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Qty: {item.quantity}</span>
                        <span className="text-lg font-bold text-secondary">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Price Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="surface-panel p-8 rounded-[3rem] border border-secondary/10"
            >
              <h2 className="text-xl font-bold text-white mb-6">Financial Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span>${(order.totalAmount - (order.shippingCost || 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Shipping</span>
                  <span>${(order.shippingCost || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-2xl font-bold gold-text pt-4 border-t border-white/10">
                  <span>Total</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-8">
            {/* Shipping Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="surface-panel p-8 rounded-[3rem] border border-secondary/10"
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <FiMapPin className="text-secondary" /> Destination
              </h2>
              <div className="text-muted text-sm leading-relaxed">
                <p className="font-bold text-light mb-2">{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.address}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                <p>{order.shippingAddress?.country}</p>
                <p className="mt-4 flex items-center gap-2"><FiTruck /> Method: Premium Express</p>
              </div>
            </motion.div>

            {/* Payment Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="surface-panel p-8 rounded-[3rem] border border-secondary/10"
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <FiCreditCard className="text-secondary" /> Payment
              </h2>
              <div className="text-muted text-sm uppercase tracking-widest">
                <p className="font-bold text-light mb-1">{order.paymentMethod?.replace('_', ' ')}</p>
                <p className="text-xs">Transaction ID: {order.paymentStatus?.toUpperCase()}</p>
              </div>
            </motion.div>

            {/* Help Card */}
            <div className="bg-secondary/10 p-8 rounded-[3rem] border border-secondary/20">
              <h3 className="text-lg font-bold text-secondary mb-4">Need Assistance?</h3>
              <p className="text-xs text-muted leading-relaxed mb-6">
                Our olfactive concierges are available to help with tracking or modifications to your order.
              </p>
              <Link to="/contact" className="text-sm font-bold text-white underline hover:text-secondary transition">
                Contact Concierge
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails
