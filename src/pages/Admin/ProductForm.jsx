import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiCheck, FiPlus, FiTrash2, FiUpload, FiImage, FiChevronDown } from 'react-icons/fi'
import { productAPI, categoryAPI } from '../../services/apiServices'
import { toast } from 'react-toastify'

const ProductForm = ({ isOpen, onClose, onSuccess }) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    stock: '',
    gender: 'unisex',
    fragranceNotes: { top: [], middle: [], base: [] },
  })
  const [selectedImages, setSelectedImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [noteInputs, setNoteInputs] = useState({ top: '', middle: '', base: '' })
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (isOpen) fetchCategories()
  }, [isOpen])

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getAllCategories()
      setCategories(res.data.categories)
    } catch {
      toast.error('Failed to load categories')
    }
  }

  const handleAddNote = (type) => {
    if (!noteInputs[type].trim()) return
    setFormData({
      ...formData,
      fragranceNotes: {
        ...formData.fragranceNotes,
        [type]: [...formData.fragranceNotes[type], noteInputs[type].trim()],
      },
    })
    setNoteInputs({ ...noteInputs, [type]: '' })
  }

  const handleRemoveNote = (type, index) => {
    const updated = [...formData.fragranceNotes[type]]
    updated.splice(index, 1)
    setFormData({ ...formData, fragranceNotes: { ...formData.fragranceNotes, [type]: updated } })
  }

  const handleImageSelect = (files) => {
    const validFiles = Array.from(files).filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!validTypes.includes(file.type)) { toast.error(`${file.name} is not a valid image type`); return false }
      if (file.size > 10 * 1024 * 1024) { toast.error(`${file.name} exceeds 10MB`); return false }
      return true
    })
    if (validFiles.length + selectedImages.length > 5) { toast.error('Maximum 5 images allowed'); return }
    setSelectedImages(prev => [...prev, ...validFiles])
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => setImagePreviews(prev => [...prev, { file, preview: e.target.result }])
      reader.readAsDataURL(file)
    })
  }

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false)
    if (e.dataTransfer.files?.[0]) handleImageSelect(e.dataTransfer.files)
  }
  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.category) return toast.error('Please select a category')
    if (selectedImages.length === 0) return toast.error('Please add at least one product image')
    setLoading(true)
    try {
      const fd = new FormData()
      Object.keys(formData).forEach(key => {
        fd.append(key, key === 'fragranceNotes' ? JSON.stringify(formData[key]) : formData[key])
      })
      selectedImages.forEach(file => fd.append('images', file))
      await productAPI.createProduct(fd)
      toast.success('Product created successfully!')
      onSuccess(); onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const noteColors = { top: 'text-secondary', middle: 'text-yellow-400', base: 'text-gray-400' }
  const noteLabels = { top: 'Top Notes', middle: 'Heart Notes', base: 'Base Notes' }
  const noteDescriptions = { top: 'First impression', middle: 'Core character', base: 'Lasting trail' }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="surface-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 md:p-8"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold gold-text">Add Product</h2>
            <p className="text-sm text-gray-400 mt-1">Create a new luxury fragrance</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Product Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-secondary/20 rounded-lg px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                placeholder="e.g. Oud Saffron Élixir"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Brand</label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={e => setFormData({ ...formData, brand: e.target.value })}
                className="w-full bg-white/5 border border-secondary/20 rounded-lg px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                placeholder="e.g. Maison Lumière"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Description</label>
            <textarea
              rows="4"
              required
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white/5 border border-secondary/20 rounded-lg px-4 py-3 focus:outline-none focus:border-secondary transition-colors resize-none"
              placeholder="Tell the story of this scent — its journey, its soul, its essence…"
            />
          </div>

          {/* Commerce Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Price (USD)</label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-white/5 border border-secondary/20 rounded-lg px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Stock</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                className="w-full bg-white/5 border border-secondary/20 rounded-lg px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Category</label>
              <div className="relative">
                <select
                  required
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-white/5 border border-secondary/20 rounded-lg px-4 py-3 focus:outline-none focus:border-secondary transition-colors appearance-none"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary" size={16} />
              </div>
            </div>
          </div>

          {/* Gender Selection */}
          <div>
            <label className="block text-sm text-gray-400 mb-3">Gender</label>
            <div className="flex gap-3 flex-wrap">
              {['unisex', 'male', 'female'].map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: g })}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    formData.gender === g
                      ? 'border-secondary bg-secondary/10 text-secondary'
                      : 'border-secondary/20 text-gray-400 hover:border-secondary/40'
                  }`}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Fragrance Notes */}
          <div>
            <label className="block text-sm text-gray-400 mb-4">Fragrance Pyramid</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['top', 'middle', 'base'].map(type => (
                <div key={type} className="bg-white/5 border border-secondary/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-3 h-3 rounded-full ${
                      type === 'top' ? 'bg-secondary' :
                      type === 'middle' ? 'bg-yellow-400' : 'bg-gray-400'
                    }`} />
                    <span className={`text-sm font-medium ${noteColors[type]}`}>
                      {noteLabels[type]}
                    </span>
                    <span className="text-xs text-gray-500 ml-auto">{noteDescriptions[type]}</span>
                  </div>

                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="Add note..."
                      value={noteInputs[type]}
                      onChange={e => setNoteInputs({ ...noteInputs, [type]: e.target.value })}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddNote(type) } }}
                      className="flex-1 bg-white/5 border border-secondary/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-secondary transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddNote(type)}
                      className="p-2 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded transition-colors"
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {formData.fragranceNotes[type].map((note, idx) => (
                        <motion.span
                          key={note + idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full"
                        >
                          {note}
                          <button
                            type="button"
                            onClick={() => handleRemoveNote(type, idx)}
                            className="hover:text-red-400 transition-colors"
                          >
                            <FiX size={10} />
                          </button>
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Product Images</label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-6 md:p-8 text-center transition-all cursor-pointer ${
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
                multiple
                accept="image/*"
                onChange={e => handleImageSelect(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-4">
                <FiUpload className={`w-8 h-8 ${dragActive ? 'text-secondary' : 'text-gray-400'}`} />
                <div>
                  <p className="text-lg font-medium text-white mb-1">
                    {dragActive ? 'Drop images here' : 'Drag & drop product images'}
                  </p>
                  <p className="text-sm text-gray-400">
                    or click to browse (max 5 images, 10MB each)
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Supported: JPG, PNG, GIF, WebP
                  </p>
                </div>
              </div>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-white/5 border border-secondary/20">
                      <img
                        src={preview.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-gray-400 mt-4">
              <div className="flex items-center gap-2">
                <FiImage />
                <span>{selectedImages.length} / 5 images selected</span>
              </div>
              <div className="w-24 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary transition-all duration-300"
                  style={{ width: `${(selectedImages.length / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-secondary/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-secondary/20 rounded-lg font-semibold hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-premium px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              ) : (
                <>
                  <FiCheck /> Create Product
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default ProductForm