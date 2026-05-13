import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import { productAPI, cartAPI, wishlistAPI, categoryAPI } from '../services/apiServices'
import { toast } from 'react-toastify'
import { FiSliders, FiX, FiSearch, FiChevronDown } from 'react-icons/fi'
import { useDispatch } from 'react-redux'
import { setCart } from '../redux/cartSlice'
import { setWishlist } from '../redux/wishlistSlice'

const Shop = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const dispatch = useDispatch()

  const [filters, setFilters] = useState({
    category: '',
    minPrice: 0,
    maxPrice: 50000,
    search: '',
    sort: 'newest',
    page: 1,
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAllCategories()
      setCategories(response.data.categories)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await productAPI.getAllProducts({
        category: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        search: filters.search,
        sort: filters.sort,
        page: filters.page,
        limit: 12,
      })
      setProducts(response.data.products)
    } catch (error) {
      toast.error('Error fetching products')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  const handleAddToCart = async (product) => {
    try {
      const res = await cartAPI.addToCart({ productId: product._id, quantity: 1 })
      dispatch(setCart(res.data.cart))
      toast.success('Added to cart!')
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  const handleAddToWishlist = async (product) => {
    try {
      const res = await wishlistAPI.addToWishlist({ productId: product._id })
      dispatch(setWishlist({ products: res.data.wishlist.products }))
      toast.success('Added to wishlist!')
    } catch (error) {
      toast.error('Failed to add to wishlist')
    }
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: 0,
      maxPrice: 50000,
      search: '',
      sort: 'newest',
      page: 1,
    })
  }

  const activeFilterCount = [
    filters.category,
    filters.search,
    filters.minPrice > 0,
    filters.maxPrice < 50000,
  ].filter(Boolean).length

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    background: '#111',
    border: '1px solid rgba(212,175,55,0.2)',
    borderRadius: '10px',
    color: '#f0e8d5',
    fontSize: '13px',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '10px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#c9a84c',
    marginBottom: '8px',
  }

  const FilterSidebar = () => (
    <div
      style={{
        background: '#0f0f0f',
        border: '1px solid rgba(212,175,55,0.12)',
        borderRadius: '20px',
        padding: '24px',
        height: 'fit-content',
        position: 'sticky',
        top: '100px',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 style={{ color: '#f0e8d5', fontWeight: 700, fontSize: '16px' }}>Filters</h3>
          {activeFilterCount > 0 && (
            <span
              style={{
                fontSize: '11px',
                color: '#c9a84c',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
              onClick={clearFilters}
            >
              Clear all ({activeFilterCount})
            </span>
          )}
        </div>
        <button
          onClick={() => setShowFilters(false)}
          className="md:hidden"
          style={{
            background: 'rgba(212,175,55,0.1)',
            border: 'none',
            borderRadius: '8px',
            padding: '6px',
            color: '#c9a84c',
            cursor: 'pointer',
          }}
        >
          <FiX size={16} />
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <label style={labelStyle}>Search</label>
        <div className="relative">
          <FiSearch
            size={14}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#c9a84c',
            }}
          />
          <input
            type="text"
            placeholder="Search fragrances..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            style={{ ...inputStyle, paddingLeft: '34px' }}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(212,175,55,0.5)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(212,175,55,0.2)')}
          />
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(212,175,55,0.08)', marginBottom: '24px' }} />

      {/* Category */}
      <div className="mb-6">
        <label style={labelStyle}>Category</label>
        <div className="relative">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', paddingRight: '32px' }}
          >
            <option value="" style={{ background: '#111' }}>All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.slug} style={{ background: '#111' }}>
                {cat.name}
              </option>
            ))}
          </select>
          <FiChevronDown
            size={14}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#c9a84c',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(212,175,55,0.08)', marginBottom: '24px' }} />

      {/* Price Range */}
      <div className="mb-6">
        <label style={labelStyle}>Price Range</label>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}
        >
          <span style={{ fontSize: '13px', color: '#8a8070' }}>
            Rs. {filters.minPrice.toLocaleString()}
          </span>
          <span style={{ fontSize: '13px', color: '#c9a84c', fontWeight: 600 }}>
            Rs. {filters.maxPrice.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="50000"
          step="500"
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
          style={{
            width: '100%',
            accentColor: '#d4af37',
            cursor: 'pointer',
          }}
        />
        <div className="flex gap-2 mt-3">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value) || 0)}
            style={{ ...inputStyle, textAlign: 'center' }}
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value) || 50000)}
            style={{ ...inputStyle, textAlign: 'center' }}
          />
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(212,175,55,0.08)', marginBottom: '24px' }} />

      {/* Sort */}
      <div>
        <label style={labelStyle}>Sort By</label>
        <div className="flex flex-col gap-2">
          {[
            { value: 'newest', label: 'Newest First' },
            { value: 'price-asc', label: 'Price: Low to High' },
            { value: 'price-desc', label: 'Price: High to Low' },
            { value: 'rating', label: 'Highest Rated' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterChange('sort', option.value)}
              style={{
                padding: '9px 14px',
                borderRadius: '10px',
                border:
                  filters.sort === option.value
                    ? '1px solid rgba(212,175,55,0.5)'
                    : '1px solid rgba(212,175,55,0.1)',
                background:
                  filters.sort === option.value
                    ? 'rgba(212,175,55,0.1)'
                    : 'transparent',
                color: filters.sort === option.value ? '#d4af37' : '#8a8070',
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div
      style={{ background: '#0a0a0a', minHeight: '100vh' }}
      className="pt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div
            className="inline-flex items-center gap-2 mb-3"
            style={{
              fontSize: '11px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#c9a84c',
            }}
          >
            <span style={{ width: '28px', height: '1px', background: '#c9a84c' }} />
            Our Collection
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(28px, 4vw, 46px)',
              fontWeight: 700,
              color: '#f5f0e8',
            }}
          >
            Explore{' '}
            <span style={{ color: '#d4af37' }}>Fragrances</span>
          </h1>
          <p style={{ color: '#8a8070', fontSize: '14px', marginTop: '8px' }}>
            {products.length} products found
          </p>
        </motion.div>

        {/* Mobile Filter Button */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <button
            onClick={() => setShowFilters(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(212,175,55,0.1)',
              border: '1px solid rgba(212,175,55,0.3)',
              borderRadius: '10px',
              padding: '10px 18px',
              color: '#d4af37',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <FiSliders size={15} />
            Filters
            {activeFilterCount > 0 && (
              <span
                style={{
                  background: '#d4af37',
                  color: '#0a0a0a',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Filter Drawer */}
        <AnimatePresence>
          {showFilters && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFilters(false)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0,0,0,0.7)',
                  zIndex: 40,
                }}
                className="md:hidden"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: '300px',
                  background: '#0a0a0a',
                  zIndex: 50,
                  overflowY: 'auto',
                  padding: '24px',
                }}
                className="md:hidden"
              >
                <FilterSidebar />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Layout */}
        <div className="flex gap-8">

          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <FilterSidebar />
          </div>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      background: '#111',
                      border: '1px solid rgba(212,175,55,0.08)',
                      borderRadius: '20px',
                      height: '340px',
                      animation: 'pulse 1.5s ease-in-out infinite',
                    }}
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    background: 'rgba(212,175,55,0.08)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    fontSize: '28px',
                  }}
                >
                  🔍
                </div>
                <h3 style={{ color: '#f0e8d5', fontWeight: 600, marginBottom: '8px' }}>
                  No products found
                </h3>
                <p style={{ color: '#8a8070', fontSize: '14px', marginBottom: '20px' }}>
                  Try adjusting your filters or search term
                </p>
                <button
                  onClick={clearFilters}
                  style={{
                    background: 'rgba(212,175,55,0.1)',
                    border: '1px solid rgba(212,175,55,0.3)',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    color: '#d4af37',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={() => handleAddToCart(product)}
                      onAddToWishlist={() => handleAddToWishlist(product)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {products.length > 0 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  onClick={() => handleFilterChange('page', Math.max(1, filters.page - 1))}
                  disabled={filters.page === 1}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '10px',
                    border: '1px solid rgba(212,175,55,0.2)',
                    background: 'transparent',
                    color: filters.page === 1 ? '#3a3530' : '#d4af37',
                    fontSize: '13px',
                    cursor: filters.page === 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  Previous
                </button>
                <span
                  style={{
                    padding: '9px 18px',
                    borderRadius: '10px',
                    background: 'rgba(212,175,55,0.1)',
                    border: '1px solid rgba(212,175,55,0.3)',
                    color: '#d4af37',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  Page {filters.page}
                </span>
                <button
                  onClick={() => handleFilterChange('page', filters.page + 1)}
                  disabled={products.length < 12}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '10px',
                    border: '1px solid rgba(212,175,55,0.2)',
                    background: 'transparent',
                    color: products.length < 12 ? '#3a3530' : '#d4af37',
                    fontSize: '13px',
                    cursor: products.length < 12 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shop