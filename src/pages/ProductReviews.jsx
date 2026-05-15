import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiStar } from 'react-icons/fi'
import { reviewAPI, productAPI } from '../services/apiServices'
import { toast } from 'react-toastify'
import LoadingSpinner from '../components/LoadingSpinner'

const ProductReviews = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, reviewsRes] = await Promise.all([
          productAPI.getProductById(id),
          reviewAPI.getProductReviews(id),
        ])
        setProduct(productRes.data.product)
        setReviews(reviewsRes.data.reviews)
      } catch (error) {
        toast.error('Error loading reviews')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading)
    return (
      <div className="min-h-screen pt-24 sm:pt-32 flex justify-center">
        <LoadingSpinner />
      </div>
    )

  return (
    <div className="min-h-screen bg-primary pt-20 sm:pt-28 md:pt-32 pb-12 sm:pb-20">
      <div className="max-w-3xl mx-auto px-3 sm:px-6">

        {/* ── Header ── */}
        <div className="mb-6 sm:mb-10">

          {/* Back button */}
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.03, x: -2 }}
            className="flex items-center gap-1.5 text-secondary hover:text-white transition mb-4 sm:mb-6 text-sm sm:text-base"
          >
            <FiArrowLeft size={15} /> Back to Product
          </motion.button>

          {/* Title row + rating card side by side */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight">
                All Reviews
              </h1>
              {product && (
                <p className="text-xs sm:text-sm text-gray-400 mt-1 truncate">
                  for <span className="text-secondary">{product.name}</span>
                </p>
              )}
            </div>

            {/* Compact rating summary */}
            <div className="bg-white/5 border border-white/10 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-center flex-shrink-0">
              <div className="text-xl sm:text-2xl font-bold gold-text leading-none mb-1">
                {product?.rating ? Number(product.rating).toFixed(1) : '0.0'}
              </div>
              <div className="flex justify-center text-secondary mb-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    size={11}
                    className="sm:hidden"
                    fill={i < Math.round(product?.rating || 0) ? 'currentColor' : 'none'}
                  />
                ))}
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    size={14}
                    className="hidden sm:block"
                    fill={i < Math.round(product?.rating || 0) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">
                {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* ── Reviews List ── */}
        <div className="space-y-3 sm:space-y-5">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="glass p-3.5 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border border-white/5 hover:border-secondary/20 transition-all duration-300"
              >
                {/* Reviewer row */}
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    {/* Avatar */}
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-xs sm:text-sm flex-shrink-0">
                      {review.user?.firstName?.charAt(0)}
                      {review.user?.lastName?.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-white text-xs sm:text-sm truncate">
                        {review.user?.firstName} {review.user?.lastName}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('en-PK', {
                          day: '2-digit', month: 'short', year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Star rating */}
                  <div className="flex text-secondary flex-shrink-0">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        size={12}
                        className="sm:hidden"
                        fill={i < review.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        size={14}
                        className="hidden sm:block"
                        fill={i < review.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                </div>

                {/* Review content */}
                <h4 className="text-sm sm:text-base font-bold text-white mb-1 sm:mb-1.5">
                  {review.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {review.comment}
                </p>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-14 sm:py-20 bg-white/5 rounded-2xl sm:rounded-3xl border border-dashed border-white/10 px-4">
              <p className="text-gray-400 text-sm sm:text-base mb-3">
                No reviews yet for this product.
              </p>
              <Link
                to={`/product/${id}`}
                className="text-secondary hover:underline text-sm sm:text-base"
              >
                Be the first to review
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default ProductReviews