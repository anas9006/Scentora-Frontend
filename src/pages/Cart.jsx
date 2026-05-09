import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiTrash2, FiArrowRight } from 'react-icons/fi'
import { cartAPI } from '../services/apiServices'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const Cart = () => {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchCart()
  }, [user, navigate])

  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart()
      setCart(response.data.cart)
    } catch (error) {
      toast.error('Error loading cart')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      await cartAPI.removeFromCart(itemId)
      fetchCart()
      toast.success('Item removed')
    } catch (error) {
      toast.error('Error removing item')
    }
  }

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return
    try {
      await cartAPI.updateCartItem(itemId, { quantity })
      fetchCart()
    } catch (error) {
      toast.error('Error updating cart')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-primary pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center py-20">
          <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-400 mb-8">Add some premium fragrances to get started</p>
          <button
            onClick={() => navigate('/shop')}
            className="btn-premium px-8 py-3 rounded font-bold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  const subtotal = cart.items.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  return (
    <div className="min-h-screen bg-primary pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="glass rounded-lg overflow-hidden">
          {/* Cart Items */}
          <div className="p-6 border-b border-gray-700">
            {cart.items.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`flex gap-4 mb-6 pb-6 ${index !== cart.items.length - 1 ? 'border-b border-gray-700' : ''}`}
              >
                {/* Image */}
                <img
                  src={item.product.images[0]?.url || 'https://via.placeholder.com/100x100'}
                  alt={item.product.name}
                  className="w-24 h-24 rounded object-cover"
                />

                {/* Details */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.product.name}</h3>
                  <p className="text-secondary text-sm">{item.product.brand}</p>
                  {item.size && <p className="text-gray-400 text-sm">Size: {item.size}</p>}
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3 border border-secondary rounded px-3 py-2">
                  <button
                    onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                    className="hover:text-secondary"
                  >
                    -
                  </button>
                  <span className="px-3">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                    className="hover:text-secondary"
                  >
                    +
                  </button>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="font-bold gold-text">${((item.product.price || 0) * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="text-red-400 hover:text-red-600 mt-2 flex items-center gap-1"
                  >
                    <FiTrash2 size={16} /> Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="p-6 bg-black">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold gold-text border-t border-gray-700 pt-3">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/checkout')}
              className="w-full btn-premium py-4 rounded font-bold flex items-center justify-center gap-2"
            >
              Proceed to Checkout <FiArrowRight />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
