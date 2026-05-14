import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { categoryAPI } from '../services/apiServices'
import LoadingSpinner from '../components/LoadingSpinner'

const Collections = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getAllCategories()
      setCategories(res.data.categories)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-12 md:pb-16 luxury-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="flex items-center justify-center gap-2 md:gap-3 text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.32em] text-secondary mb-3">
            <span className="h-px w-8 md:w-12 bg-secondary rounded-full"></span>
            Explore Our World
            <span className="h-px w-8 md:w-12 bg-secondary rounded-full"></span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold gold-text gold-glow mb-3 md:mb-4">Exquisite Collections</h1>
          <p className="max-w-xl mx-auto text-muted text-xs md:text-sm leading-relaxed">
            Discover a curated selection of olfactive masterpieces, each telling a unique story of luxury and refinement.
          </p>
        </motion.div>

        {loading ? (
          <LoadingSpinner />
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <Link to={`/shop?category=${category.slug}`} className="block h-full">
                  <div className="surface-panel h-full rounded-xl md:rounded-2xl overflow-hidden border border-secondary/10 group-hover:border-secondary/40 transition-all duration-500">
                    <div className="relative h-[260px] sm:h-[300px] lg:h-[330px]">
                      <img
                        src={category.image?.url || 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000'}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent opacity-85"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                        <div className="flex items-center gap-2 text-secondary text-[10px] uppercase tracking-[0.2em] mb-2">
                          <span className="w-6 h-px bg-secondary"></span>
                          {category.products?.length || 0} Fragrances
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">{category.name}</h2>
                        <p className="text-gray-300 text-xs md:text-sm line-clamp-2 leading-relaxed opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500">
                          {category.description || 'Explore our exclusive collection of premium fragrances.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="surface-panel rounded-2xl border border-secondary/10 p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-2">No collections yet</h2>
            <p className="text-muted text-sm">New fragrance collections will appear here soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Collections
