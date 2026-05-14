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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg p-8 surface-panel border border-secondary/20 rounded-3xl"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition"
          >
            <FiX size={24} />
          </button>

          <h2 className="text-2xl font-bold text-white mb-6">Write a Review</h2>
          
          <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl bg-white/5 border border-white/5">
            <img 
              src={product.images?.[0]?.url || '/placeholder-perfume.jpg'} 
              alt={product.name} 
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div>
              <p className="font-bold text-light">{product.name}</p>
              <p className="text-sm text-muted">{product.brand}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Rating */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Rating</label>
              <div className="flex gap-2 text-3xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`transition-colors ${star <= rating ? 'text-secondary' : 'text-gray-600'}`}
                  >
                    <FiStar fill={star <= rating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Review Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Sum up your experience"
                className="w-full bg-dark border border-secondary/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition placeholder-gray-600"
                required
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Detailed Review</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like or dislike about this product?"
                className="w-full bg-dark border border-secondary/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition placeholder-gray-600 h-32 resize-none"
                required
              />
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-premium py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              ) : (
                'Submit Review'
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ReviewModal
