import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiX, FiCheck } from 'react-icons/fi'
import { categoryAPI } from '../../services/apiServices'
import { toast } from 'react-toastify'

const CategoryForm = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await categoryAPI.createCategory(formData)
      toast.success('Category created successfully!')
      setFormData({ name: '', description: '' })
      onSuccess()
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create category')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="surface-panel w-full max-w-md rounded-2xl p-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold gold-text">Add Category</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Category Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white/5 border border-secondary/20 rounded px-4 py-3 focus:outline-none focus:border-secondary transition"
              placeholder="e.g. Floral, Woody, Oriental"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Description</label>
            <textarea
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white/5 border border-secondary/20 rounded px-4 py-3 focus:outline-none focus:border-secondary transition"
              placeholder="Describe this fragrance category..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-secondary/20 rounded font-semibold hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-premium px-6 py-3 rounded font-bold flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              ) : (
                <>
                  <FiCheck /> Create
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default CategoryForm
