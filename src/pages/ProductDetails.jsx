import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiHeart, FiStar, FiArrowLeft } from 'react-icons/fi'
import { productAPI, cartAPI, wishlistAPI, reviewAPI } from '../services/apiServices'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { setCart } from '../redux/cartSlice'
import { setWishlist } from '../redux/wishlistSlice'
import LoadingSpinner from '../components/LoadingSpinner'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false)
  const wishlistItems = useSelector((state) => state.wishlist.items)
  const dispatch = useDispatch()

  useEffect(() => {
    fetchProductDetails()
    fetchReviews()
  }, [id])

  const fetchProductDetails = async () => {
    try {
      const response = await productAPI.getProductById(id)
      setProduct(response.data.product)
    } catch (error) {
      toast.error('Error loading product')
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await reviewAPI.getProductReviews(id)
      setReviews(response.data.reviews)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const handleAddToCart = async () => {
    if (isAddingToCart) return
    setIsAddingToCart(true)
    try {
      const res = await cartAPI.addToCart({ productId: product._id, quantity })
      dispatch(setCart(res.data.cart))
      toast.success('Added to cart!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleWishlistToggle = async () => {
    if (isTogglingWishlist) return
    setIsTogglingWishlist(true)
    try {
      if (isWishlisted) {
        const res = await wishlistAPI.removeFromWishlist(product._id)
        dispatch(setWishlist({ products: res.data.wishlist.products }))
        toast.success('Removed from wishlist')
      } else {
        const res = await wishlistAPI.addToWishlist({ productId: product._id })
        dispatch(setWishlist({ products: res.data.wishlist.products }))
        toast.success('Added to wishlist!')
      }
    } catch (error) {
      toast.error('Failed to update wishlist')
    } finally {
      setIsTogglingWishlist(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><LoadingSpinner /></div>
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col gap-4 px-4 text-center">
        <p>Product not found</p>
        <Link to="/shop" className="btn-premium px-4 py-2 rounded">Back to Shop</Link>
      </div>
    )
  }

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0
  const getProductId = (item) => item?._id || item?.product?._id || item?.product || item
  const isWishlisted = wishlistItems.some(
    (item) => String(getProductId(item)) === String(product._id)
  )

  return (
    <div className="min-h-screen bg-primary pt-18 sm:pt-22 md:pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

        {/* Back + Breadcrumb */}
        <div className="mb-5 sm:mb-8 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05, x: -3 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded border border-secondary text-secondary hover:bg-secondary hover:text-primary transition font-semibold text-xs sm:text-sm w-fit"
          >
            <FiArrowLeft className="text-sm sm:text-base" />
            Go Back
          </motion.button>
          <div className="text-gray-400 text-xs sm:text-sm flex items-center gap-1 min-w-0">
            <Link to="/shop" className="hover:text-secondary transition shrink-0">Shop</Link>
            <span className="mx-1">/</span>
            <span className="text-gray-200 truncate">{product.name}</span>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-12">

          {/* ── Image Section ── */}
          <div>
            <motion.div className="mb-3 sm:mb-4 h-56 xs:h-64 sm:h-80 md:h-96 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src={product.images[selectedImage]?.url || 'https://via.placeholder.com/400x400'}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
            </motion.div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {product.images.map((img, index) => (
                  <motion.img
                    key={index}
                    src={img.url}
                    alt={`${product.name} ${index}`}
                    onClick={() => setSelectedImage(index)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded cursor-pointer border-2 object-cover transition ${
                      selectedImage === index ? 'border-secondary' : 'border-gray-700'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Details Section ── */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

              {/* Name + Brand */}
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1.5 sm:mb-2 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 mb-3 sm:mb-4">
                <p className="gold-text text-base sm:text-lg">{product.brand}</p>
                {product.gender && (
                  <span className="bg-white/5 border border-secondary/20 text-secondary px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                    {product.gender}
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="flex text-secondary text-sm sm:text-base">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} fill="currentColor" />
                  ))}
                </div>
                <span className="text-gray-400 text-xs sm:text-sm">
                  ({product.rating ? Number(product.rating).toFixed(1) : '0.0'}/5)
                </span>
              </div>

              {/* Price */}
              <div className="mb-4 sm:mb-6">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold gold-text">
                    Rs. {product.discountPrice || product.price}
                  </span>
                  {product.discountPrice && (
                    <>
                      <span className="text-lg sm:text-xl md:text-2xl line-through text-gray-500">
                        Rs. {product.price}
                      </span>
                      <span className="bg-secondary text-primary px-2 sm:px-3 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-bold">
                        Save {discount}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                {product.description}
              </p>

              {/* Fragrance Notes */}
              {product.fragranceNotes && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Fragrance Notes</h3>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {[
                      { label: 'TOP NOTES',    notes: product.fragranceNotes.top },
                      { label: 'MIDDLE NOTES', notes: product.fragranceNotes.middle },
                      { label: 'BASE NOTES',   notes: product.fragranceNotes.base },
                    ].map(({ label, notes }) => notes?.length > 0 && (
                      <div key={label} className="glass p-2 sm:p-3 rounded">
                        <p className="text-secondary text-[9px] sm:text-xs font-bold">{label}</p>
                        <p className="text-xs sm:text-sm mt-0.5 sm:mt-1">{notes.join(', ')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="mb-4 sm:mb-6">
                <p className={`text-xs sm:text-sm font-medium ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
                </p>
              </div>

              {/* Quantity + Actions */}
              <div className="flex flex-wrap gap-2 sm:gap-4">
                {/* Quantity selector */}
                <div className="flex items-center border border-secondary rounded overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 sm:px-4 py-2 sm:py-2.5 hover:bg-secondary hover:text-primary transition text-sm sm:text-base font-bold"
                  >
                    −
                  </button>
                  <span className="px-3 sm:px-4 min-w-[2rem] text-center text-sm sm:text-base">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="px-3 sm:px-4 py-2 sm:py-2.5 hover:bg-secondary hover:text-primary disabled:opacity-50 transition text-sm sm:text-base font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <motion.button
                  whileHover={{ scale: isAddingToCart ? 1 : 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || isAddingToCart}
                  className="flex-1 min-w-[120px] btn-premium rounded font-bold flex items-center justify-center gap-2 disabled:opacity-50 py-2.5 sm:py-3 text-sm sm:text-base"
                >
                  {isAddingToCart ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <FiShoppingCart size={16} />
                      Add to Cart
                    </>
                  )}
                </motion.button>

                {/* Wishlist toggle */}
                <motion.button
                  whileHover={{ scale: isTogglingWishlist ? 1 : 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleWishlistToggle}
                  disabled={isTogglingWishlist}
                  className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded font-bold border-2 transition flex items-center justify-center disabled:cursor-not-allowed ${
                    isWishlisted
                      ? 'bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700'
                      : 'border-secondary text-secondary hover:bg-secondary hover:text-primary'
                  }`}
                >
                  {isTogglingWishlist ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FiHeart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                  )}
                </motion.button>
              </div>

            </motion.div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-secondary pt-8 sm:pt-12">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6">Reviews</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="glass p-3 sm:p-4 rounded">
                  <div className="flex text-secondary mb-1.5 sm:mb-2 text-sm">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <h4 className="font-semibold mb-1 text-sm sm:text-base">{review.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-300 mb-1.5 sm:mb-2">{review.comment}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    {review.user.firstName} {review.user.lastName}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm sm:text-base col-span-full">
                No reviews yet. Be the first to review!
              </p>
            )}
          </div>

          {reviews.length > 0 && (
            <div className="mt-6 sm:mt-8 text-center">
              <Link
                to={`/product/${id}/reviews`}
                className="inline-flex items-center gap-2 text-secondary hover:text-white transition font-semibold text-sm sm:text-base"
              >
                See All Reviews ({reviews.length})
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default ProductDetails