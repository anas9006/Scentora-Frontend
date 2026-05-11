import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiX, FiCheck, FiUpload, FiImage } from 'react-icons/fi'
import { categoryAPI } from '../../services/apiServices'
import { toast } from 'react-toastify'

const CategoryForm = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)

  // Image upload state
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  // Image handling functions
  const handleImageSelect = (files) => {
    const file = files[0]
    if (!file) return

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file')
      return
    }

    if (file.size > maxSize) {
      toast.error('Image is too large (max 10MB)')
      return
    }

    setSelectedImage(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageSelect(e.dataTransfer.files)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formDataToSend = new FormData()

      // Add basic form data
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)

      // Add image if selected
      if (selectedImage) {
        formDataToSend.append('image', selectedImage)
      }

      await categoryAPI.createCategory(formDataToSend)
      toast.success('Category created successfully!')
      setFormData({ name: '', description: '' })
      setSelectedImage(null)
      setImagePreview('')
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

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Category Image (Optional)</label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                dragActive
                  ? 'border-secondary bg-secondary/10'
                  : 'border-secondary/20 hover:border-secondary/40'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageSelect(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-3">
                <FiUpload className={`w-8 h-8 ${dragActive ? 'text-secondary' : 'text-gray-400'}`} />
                <div>
                  <p className="text-sm font-medium text-white">
                    {dragActive ? 'Drop image here' : 'Drag & drop category image'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    or click to browse (max 10MB)
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supported: JPG, PNG, GIF, WebP
                  </p>
                </div>
              </div>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4 relative group">
                <div className="aspect-video rounded-lg overflow-hidden bg-white/5 border border-secondary/20">
                  <img
                    src={imagePreview}
                    alt="Category preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiX size={12} />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
              <FiImage />
              <span>{selectedImage ? '1 image selected' : 'No image selected'}</span>
            </div>
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
