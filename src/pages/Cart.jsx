import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiTrash2, FiArrowRight } from 'react-icons/fi'
import { cartAPI } from '../services/apiServices'
import LoadingSpinner from '../components/LoadingSpinner'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { setCart as setReduxCart } from '../redux/cartSlice'

const Cart = () => {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deletingItemId, setDeletingItemId] = useState(null)
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const debounceTimeoutRef = useRef({})

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchCart()
    return () => {
      // Clean up all pending timeouts on unmount
      Object.values(debounceTimeoutRef.current).forEach(clearTimeout)
    }
  }, [user, navigate])

  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart()
      setCart(response.data.cart)
      dispatch(setReduxCart(response.data.cart))
    } catch (error) {
      toast.error('Error loading cart')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveItem = async (itemId) => {
    setDeletingItemId(itemId)
    try {
      await cartAPI.removeFromCart(itemId)
      fetchCart()
      toast.success('Item removed')
    } catch (error) {
      toast.error('Error removing item')
    } finally {
      setDeletingItemId(null)
    }
  }

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return

    // Find the item to check stock limit
    const item = cart?.items?.find(i => i._id === itemId)
    if (!item) return

    // Check stock limit on frontend immediately
    if (item.product && newQuantity > item.product.stock) {
      toast.error(`Only ${item.product.stock} item(s) available in stock.`)
      return
    }

    // 1. Update UI and Redux immediately (Optimistic Update)
    const updatedItems = cart.items.map(i => {
      if (i._id === itemId) {
        return { ...i, quantity: newQuantity }
      }
      return i
    })
    const updatedCart = { ...cart, items: updatedItems }
    
    setCart(updatedCart)
    dispatch(setReduxCart(updatedCart))

    // 2. Debounced API Sync
    // Clear existing timeout for this item if any
    if (debounceTimeoutRef.current[itemId]) {
      clearTimeout(debounceTimeoutRef.current[itemId])
    }

    // Set a new timeout
    debounceTimeoutRef.current[itemId] = setTimeout(async () => {
      try {
        await cartAPI.updateCartItem(itemId, { quantity: newQuantity })
        // Silent update to sync any dynamic server fields without flashing UI
        const response = await cartAPI.getCart()
        dispatch(setReduxCart(response.data.cart))
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error updating quantity')
        // Revert to original cart from server on failure
        fetchCart()
      }
    }, 500) // 500ms debounce
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><LoadingSpinner /></div>
  }

  const validItems = cart?.items?.filter(item => item && item.product) || []

  if (!cart || validItems.length === 0) {
    return (
      <div className="min-h-screen bg-primary pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center py-20">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-400 text-sm md:text-base mb-8">Add some premium fragrances to get started</p>
          <button
            onClick={() => navigate('/shop')}
            className="btn-premium px-6 md:px-8 py-3 rounded-lg text-xs md:text-sm font-bold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  const subtotal = validItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax
  const formatPrice = (amount) => `Rs. ${Number(amount || 0).toFixed(2)}`

  return (
    <div className="min-h-screen bg-primary pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">Shopping Cart</h1>

        <div className="glass rounded-xl md:rounded-2xl overflow-hidden border border-secondary/10">
          {/* Cart Items */}
          <div className="p-4 md:p-6 border-b border-gray-700">
            {validItems.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`grid grid-cols-[84px_1fr] md:grid-cols-[96px_1fr_auto_auto] gap-3 md:gap-5 items-start md:items-center ${index !== validItems.length - 1 ? 'mb-5 pb-5 border-b border-gray-700' : ''}`}
              >
                {/* Image */}
                <Link to={`/product/${item.product?._id}`} className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden object-cover bg-white/5 hover:opacity-85 transition-opacity flex-shrink-0">
                  <img
                    src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/100x100'}
                    alt={item.product?.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Details */}
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-3 md:block">
                    <div className="min-w-0">
                      <Link to={`/product/${item.product?._id}`} className="hover:text-secondary transition-colors">
                        <h3 className="font-semibold text-sm md:text-lg leading-snug text-light line-clamp-2">{item.product?.name}</h3>
                      </Link>
                      <p className="text-secondary text-xs md:text-sm mt-1">{item.product?.brand}</p>
                      {item.size && <p className="text-gray-400 text-xs md:text-sm mt-1">Size: {item.size}</p>}
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      disabled={deletingItemId !== null}
                      aria-label={`Remove ${item.product?.name}`}
                      className="md:hidden inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:text-red-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingItemId === item._id ? (
                        <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                      ) : (
                        <FiTrash2 size={16} />
                      )}
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm">
                    <span className="text-muted">Unit: <span className="text-light">{formatPrice(item.product?.price)}</span></span>
                    <span className="font-bold gold-text">Item total: {formatPrice((item.product?.price || 0) * item.quantity)}</span>
                  </div>
                </div>

                {/* Quantity */}
                <div className="col-span-2 md:col-span-1 flex w-full md:w-auto items-center justify-between md:justify-center gap-3 border border-secondary/70 rounded-lg px-3 py-2 bg-black/20">
                  <button
                    onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                    className="h-8 w-8 rounded-md hover:bg-secondary/10 hover:text-secondary text-sm font-bold transition"
                  >
                    -
                  </button>
                  <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                    className="h-8 w-8 rounded-md hover:bg-secondary/10 hover:text-secondary text-sm font-bold transition"
                  >
                    +
                  </button>
                </div>

                {/* Price */}
                <div className="hidden md:block text-right min-w-[120px]">
                  <p className="text-xs text-muted mb-1">Line total</p>
                  <p className="font-bold gold-text">{formatPrice((item.product?.price || 0) * item.quantity)}</p>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    disabled={deletingItemId !== null}
                    aria-label={`Remove ${item.product?.name}`}
                    className="mt-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:text-red-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingItemId === item._id ? (
                      <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                    ) : (
                      <FiTrash2 size={16} />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="p-4 md:p-6 bg-black">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-400 text-sm md:text-base">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-400 text-sm md:text-base">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-gray-400 text-sm md:text-base">
                <span>Estimated Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between text-xl md:text-2xl font-bold pt-4 border-t border-gray-700">
                <span>Total</span>
                <span className="gold-text">{formatPrice(total)}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/checkout')}
              className="w-full btn-premium py-3.5 md:py-4 rounded-lg font-bold text-xs md:text-sm flex items-center justify-center gap-2"
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
