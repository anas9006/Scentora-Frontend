import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiStar } from 'react-icons/fi'
import { reviewAPI } from '../services/apiServices'
import { toast } from 'react-toastify'

const ReviewModal = ({ isOpen, onClose, product }) => {
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen || !product) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !comment.trim()) {
      toast.error('Please provide a title and a comment.')
      return
    }
    
    setIsSubmitting(true)
    try {
      await reviewAPI.createReview({
        productId: product._id,
        rating,
        title,
        comment
      })
      toast.success('Review submitted successfully!')
      setRating(5)
      setTitle('')
      setComment('')
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm">
        {/* Backdrop - Click to close */}
        <div 
          className="absolute inset-0" 
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full sm:max-w-md mx-auto surface-panel border border-secondary/20 rounded-t-3xl sm:rounded-3xl overflow-hidden z-10"
        >
          {/* Header */}
          <div className="sticky top-0 bg-[#0d0d0d]/95 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-white">Write a Review</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition p-1.5 hover:bg-white/5 rounded-lg"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="max-h-[calc(100vh-8rem)] sm:max-h-[70vh] overflow-y-auto px-4 sm:px-6 py-4 sm:py-5">
            {/* Product Info */}
            <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-white/5 border border-white/5">
              <img 
                src={product.images?.[0]?.url || '/placeholder-perfume.jpg'} 
                alt={product.name} 
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-light text-sm sm:text-base truncate">{product.name}</p>
                <p className="text-xs sm:text-sm text-muted truncate">{product.brand}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                  Rating <span className="text-secondary">*</span>
                </label>
                <div className="flex gap-1.5 sm:gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`transition-all text-2xl sm:text-3xl ${
                        star <= rating ? 'text-secondary scale-110' : 'text-gray-600 hover:text-gray-500'
                      }`}
                    >
                      <FiStar 
                        fill={star <= rating ? 'currentColor' : 'none'} 
                        strokeWidth={star <= rating ? 0 : 2}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted mt-1.5">
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                  Review Title <span className="text-secondary">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Sum up your experience"
                  maxLength={100}
                  className="w-full bg-dark border border-secondary/20 rounded-lg px-3 py-2 sm:py-2.5 text-sm text-white focus:outline-none focus:border-secondary transition placeholder-gray-600"
                  required
                />
                <p className="text-xs text-muted mt-1 text-right">{title.length}/100</p>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                  Detailed Review <span className="text-secondary">*</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you like or dislike about this product?"
                  maxLength={500}
                  className="w-full bg-dark border border-secondary/20 rounded-lg px-3 py-2 sm:py-2.5 text-sm text-white focus:outline-none focus:border-secondary transition placeholder-gray-600 h-24 sm:h-28 resize-none"
                  required
                />
                <p className="text-xs text-muted mt-1 text-right">{comment.length}/500</p>
              </div>

              {/* Submit Button */}
              <div className="sticky bottom-0 -mx-4 sm:-mx-6 -mb-4 sm:-mb-5 p-4 sm:p-5 bg-[#0d0d0d]/95 backdrop-blur-xl border-t border-white/5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-premium py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ReviewModal