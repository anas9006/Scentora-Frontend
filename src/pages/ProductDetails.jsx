import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi'
import { productAPI, cartAPI, wishlistAPI, reviewAPI } from '../services/apiServices'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { setCart } from '../redux/cartSlice'
import { setWishlist } from '../redux/wishlistSlice'

const ProductDetails = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
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
    try {
      const res = await cartAPI.addToCart({
        productId: product._id,
        quantity,
      })
      dispatch(setCart(res.data.cart))
      toast.success('Added to cart!')
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  const handleAddToWishlist = async () => {
    try {
      const res = await wishlistAPI.addToWishlist({ productId: product._id })
      dispatch(setWishlist({ products: res.data.wishlist.products }))
      toast.success('Added to wishlist!')
    } catch (error) {
      toast.error('Failed to add to wishlist')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col gap-4">
        <p>Product not found</p>
        <Link to="/shop" className="btn-premium px-4 py-2 rounded">Back to Shop</Link>
      </div>
    )
  }

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0
  const getProductId = (item) => item?._id || item?.product?._id || item?.product || item
  const isWishlisted = wishlistItems.some((item) => String(getProductId(item)) === String(product._id))

  return (
    <div className="min-h-screen bg-primary pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8 text-gray-400">
          <Link to="/shop" className="hover:gold-text">Shop</Link> / {product.name}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Image Section */}
          <div>
            <motion.div className="mb-4 h-96 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src={product.images[selectedImage]?.url || 'https://via.placeholder.com/400x400'}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
            </motion.div>

            {/* Thumbnails */}
            <div className="flex gap-2">
              {product.images.map((img, index) => (
                <motion.img
                  key={index}
                  src={img.url}
                  alt={`${product.name} ${index}`}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded cursor-pointer border-2 ${selectedImage === index ? 'border-secondary' : 'border-gray-700'}`}
                  whileHover={{ scale: 1.05 }}
                />
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="gold-text text-lg mb-4">{product.brand}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-secondary">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} fill="currentColor" />
                  ))}
                </div>
                <span className="text-gray-400">({product.rating}/5)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl font-bold gold-text">
                    Rs. {product.discountPrice || product.price}
                  </span>
                  {product.discountPrice && (
                    <>
                      <span className="text-2xl line-through text-gray-500">
                        Rs. {product.price}
                      </span>
                      <span className="bg-secondary text-primary px-3 py-1 rounded text-sm font-bold">
                        Save {discount}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 mb-6">{product.description}</p>

              {/* Fragrance Notes */}
              {product.fragranceNotes && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Fragrance Notes</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {product.fragranceNotes.top && (
                      <div className="glass p-3 rounded">
                        <p className="text-secondary text-xs font-bold">TOP NOTES</p>
                        <p className="text-sm">{product.fragranceNotes.top.join(', ')}</p>
                      </div>
                    )}
                    {product.fragranceNotes.middle && (
                      <div className="glass p-3 rounded">
                        <p className="text-secondary text-xs font-bold">MIDDLE NOTES</p>
                        <p className="text-sm">{product.fragranceNotes.middle.join(', ')}</p>
                      </div>
                    )}
                    {product.fragranceNotes.base && (
                      <div className="glass p-3 rounded">
                        <p className="text-secondary text-xs font-bold">BASE NOTES</p>
                        <p className="text-sm">{product.fragranceNotes.base.join(', ')}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="mb-6">
                <p className={product.stock > 0 ? 'text-green-400' : 'text-red-400'}>
                  {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
                </p>
              </div>

              {/* Quantity & Actions */}
              <div className="flex flex-wrap sm:flex-nowrap gap-4 mb-6">
                <div className="flex items-center gap-3 border border-secondary rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-secondary hover:text-primary"
                  >
                    -
                  </button>
                  <span className="px-4">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="px-3 py-2 hover:bg-secondary hover:text-primary disabled:opacity-50"
                  >
                    +
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 btn-premium rounded font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FiShoppingCart /> Add to Cart
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleAddToWishlist}
                  className={`px-6 py-3 rounded font-bold border-2 transition ${
                    isWishlisted
                      ? 'bg-secondary text-primary border-secondary'
                      : 'border-secondary text-secondary hover:bg-secondary hover:text-primary'
                  }`}
                >
                  <FiHeart fill={isWishlisted ? 'currentColor' : 'none'} />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-secondary pt-12">
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="glass p-4 rounded">
                  <div className="flex text-secondary mb-2">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <h4 className="font-semibold mb-1">{review.title}</h4>
                  <p className="text-sm text-gray-300 mb-2">{review.comment}</p>
                  <p className="text-xs text-gray-500">{review.user.firstName} {review.user.lastName}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
