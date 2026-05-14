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
          reviewAPI.getProductReviews(id)
        ])
        setProduct(productRes.data.product)
        setReviews(reviewsRes.data.reviews)
      } catch (error) {
        toast.error('Error loading reviews')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) return <div className="min-h-screen pt-32 flex justify-center"><LoadingSpinner /></div>

  return (
    <div className="min-h-screen bg-primary pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div>
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05, x: -3 }}
              className="flex items-center gap-2 text-secondary hover:text-white transition mb-4"
            >
              <FiArrowLeft /> Back to Product
            </motion.button>
            <h1 className="text-3xl font-bold text-white">All Reviews</h1>
            {product && <p className="text-gray-400 mt-2">for <span className="text-secondary">{product.name}</span></p>}
          </div>
          
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center min-w-[150px]">
             <div className="text-3xl font-bold gold-text">{product?.rating?.toFixed(1) || '0.0'}</div>
             <div className="flex justify-center text-secondary my-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} fill={i < Math.round(product?.rating || 0) ? "currentColor" : "none"} size={16} />
                ))}
             </div>
             <div className="text-xs text-gray-500">{reviews.length} total reviews</div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass p-6 rounded-3xl border border-white/5 hover:border-secondary/20 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold">
                      {review.user?.firstName?.charAt(0)}{review.user?.lastName?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white">{review.user?.firstName} {review.user?.lastName}</p>
                      <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex text-secondary">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} fill={i < review.rating ? "currentColor" : "none"} size={14} />
                    ))}
                  </div>
                </div>
                
                <h4 className="text-lg font-bold text-white mb-2">{review.title}</h4>
                <p className="text-gray-300 leading-relaxed">{review.comment}</p>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <p className="text-gray-400">No reviews yet for this product.</p>
              <Link to={`/product/${id}`} className="text-secondary hover:underline mt-4 inline-block">Be the first to review</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductReviews
