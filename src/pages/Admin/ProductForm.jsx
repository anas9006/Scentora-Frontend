import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiX, FiCheck, FiPlus, FiTrash2 } from 'react-icons/fi'
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
    fragranceNotes: {
      top: [],
      middle: [],
      base: [],
    },
  })

  // State for fragrance notes input
  const [noteInputs, setNoteInputs] = useState({ top: '', middle: '', base: '' })

  useEffect(() => {
    if (isOpen) {
      fetchCategories()
    }
  }, [isOpen])

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getAllCategories()
      setCategories(res.data.categories)
    } catch (error) {
      toast.error('Failed to load categories')
    }
  }

  const handleAddNote = (type) => {
    if (!noteInputs[type]) return
    setFormData({
      ...formData,
      fragranceNotes: {
        ...formData.fragranceNotes,
        [type]: [...formData.fragranceNotes[type], noteInputs[type]],
      },
    })
    setNoteInputs({ ...noteInputs, [type]: '' })
  }

  const handleRemoveNote = (type, index) => {
    const updatedNotes = [...formData.fragranceNotes[type]]
    updatedNotes.splice(index, 1)
    setFormData({
      ...formData,
      fragranceNotes: {
        ...formData.fragranceNotes,
        [type]: updatedNotes,
      },
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.category) return toast.error('Please select a category')
    
    setLoading(true)
    try {
      await productAPI.createProduct(formData)
      toast.success('Product created successfully!')
      onSuccess()
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface-panel w-full max-w-2xl rounded-2xl p-8 my-8"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold gold-text">Add Masterpiece</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FiX size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Product Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-secondary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition"
                placeholder="Perfume name"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Brand</label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full bg-white/5 border border-secondary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition"
                placeholder="House name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Description</label>
            <textarea
              rows="3"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white/5 border border-secondary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition"
              placeholder="Tell the story of this scent..."
            />
          </div>

          {/* Pricing and Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Price ($)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-white/5 border border-secondary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Stock</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full bg-white/5 border border-secondary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Category</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-white/5 border border-secondary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition appearance-none"
              >
                <option value="" className="bg-primary text-gray-400">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id} className="bg-primary text-white">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Gender and Attributes */}
          <div className="flex gap-8">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Gender:</span>
              {['unisex', 'male', 'female'].map((g) => (
                <label key={g} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="hidden"
                  />
                  <span className={`px-4 py-1 rounded-full text-xs uppercase border ${
                    formData.gender === g ? 'bg-secondary text-primary border-secondary font-bold' : 'border-secondary/20 text-gray-400'
                  }`}>
                    {g}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Fragrance Notes */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <h3 className="text-lg font-semibold gold-text">Fragrance Pyramid</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['top', 'middle', 'base'].map((type) => (
                <div key={type} className="space-y-3">
                  <label className="block text-xs uppercase tracking-widest text-muted">{type} Notes</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={noteInputs[type]}
                      onChange={(e) => setNoteInputs({ ...noteInputs, [type]: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNote(type))}
                      className="flex-1 bg-white/5 border border-secondary/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary"
                      placeholder="Add note..."
                    />
                    <button
                      type="button"
                      onClick={() => handleAddNote(type)}
                      className="p-2 bg-secondary text-primary rounded-lg"
                    >
                      <FiPlus />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.fragranceNotes[type].map((note, idx) => (
                      <span key={idx} className="flex items-center gap-2 bg-white/10 px-2 py-1 rounded text-xs text-light">
                        {note}
                        <FiTrash2
                          className="cursor-pointer hover:text-red-400"
                          onClick={() => handleRemoveNote(type, idx)}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 border border-secondary/20 rounded-xl font-semibold hover:bg-white/5 transition"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-premium px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              ) : (
                <>
                  <FiCheck /> Launch Product
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
