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
    <div className="min-h-screen pt-32 pb-20 px-4 luxury-gradient">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 text-xs md:text-sm uppercase tracking-[0.3em] md:tracking-[0.4em] text-secondary mb-4">
            <span className="h-0.5 w-12 bg-secondary rounded-full"></span>
            Explore Our World
            <span className="h-0.5 w-12 bg-secondary rounded-full"></span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold gold-text gold-glow mb-6">Exquisite Collections</h1>
          <p className="max-w-2xl mx-auto text-muted text-base md:text-lg">
            Discover a curated selection of olfactive masterpieces, each telling a unique story of luxury and refinement.
          </p>
        </motion.div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <Link to={`/shop?category=${category.slug}`} className="block">
                  <div className="surface-panel rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-secondary/10 group-hover:border-secondary/40 transition-all duration-500">
                    <div className="relative h-[350px] md:h-[400px]">
                      <img
                        src={category.image?.url || 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000'}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="flex items-center gap-2 text-secondary text-xs uppercase tracking-widest mb-3">
                          <span className="w-8 h-px bg-secondary"></span>
                          {category.products?.length || 0} Fragrances
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{category.name}</h2>
                        <p className="text-gray-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          {category.description || 'Explore our exclusive collection of premium fragrances.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Collections