import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { productAPI, cartAPI, wishlistAPI } from '../services/apiServices'
import { useDispatch } from 'react-redux'
import { setCart } from '../redux/cartSlice'
import { setWishlist } from '../redux/wishlistSlice'
import { toast } from 'react-toastify'
import MistBackground from '../components/MistBackground'
import heroImage from '../assets/hero-perfume.png'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productAPI.getFeaturedProducts()
      setFeaturedProducts(response.data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
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

  return (
    <div className="relative">
      <MistBackground />
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-b from-dark via-primary to-dark flex items-center px-4 pt-20">
        <div className="max-w-7xl mx-auto grid gap-12 lg:grid-cols-[1.15fr_0.85fr] items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 text-sm uppercase tracking-[0.35em] text-secondary">
              <span className="h-0.5 w-16 bg-secondary rounded-full"></span>
              Premium Collection
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Sculpting <span className="gold-text gold-glow">Dreams</span> in a Bottle
            </h1>
            <p className="max-w-2xl text-lg text-[#bdb4a7]">
              Explore an elite world of bespoke perfumes crafted for the modern connoisseur. Scentora blends art and olfactive luxury into every bottle.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="btn-premium px-6 py-3 rounded font-bold text-sm">
                View All Perfumes
              </Link>
              <button className="border border-secondary text-secondary px-6 py-3 rounded font-semibold text-sm hover:bg-secondary/20 transition">
                Explore Editions
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-[#b3aba1]">
              <div className="surface-panel p-4 rounded-2xl">
                <p className="text-secondary uppercase tracking-[0.2em] mb-1 text-[10px]">Timeless scents</p>
                <p className="font-semibold text-lg">100+</p>
              </div>
              <div className="surface-panel p-4 rounded-2xl">
                <p className="text-secondary uppercase tracking-[0.2em] mb-1 text-[10px]">Unique blends</p>
                <p className="font-semibold text-lg">80k+</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="surface-panel relative overflow-hidden rounded-[1.5rem] p-6">
              {/* <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-transparent pointer-events-none"></div> */}
              <div className="relative rounded-[1.25rem] overflow-hidden bg-[#111111]">
                <div className="w-full h-[400px] flex items-center justify-center relative group">
                  <motion.div
                    animate={{ 
                      y: [0, -15, 0],
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative z-10"
                  >
                    <img 
                      src={heroImage} 
                      alt="Scentora Signature Fragrance" 
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                    />
                  </motion.div>
                  {/* Decorative elements behind image */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15),transparent_70%)]"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Elysian <span className="gold-text">Elegance</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {['Oud Elite', 'Golden Floral', 'Noir Spice'].map((collection, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="surface-panel p-6 rounded-[1.5rem] border border-secondary/15 hover:border-secondary/30 transition cursor-pointer"
              >
                <p className="text-secondary uppercase tracking-[0.3em] mb-3 text-[10px]">Signature</p>
                <h3 className="text-xl font-semibold mb-3">{collection}</h3>
                <p className="text-[#b3aba1] text-sm">A refined sensory journey built for collectors who enjoy rare, handcrafted fragrances.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-dark">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Best <span className="gold-text">Sellers</span>
          </motion.h2>

          {loading ? (
            <div className="text-center py-12 text-[#b3aba1]">
              <p>Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={() => handleAddToCart(product)}
                    onAddToWishlist={() => handleAddToWishlist(product)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto grid gap-10 lg:grid-cols-[0.9fr_0.7fr] items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Journey of <span className="gold-text">Elysian Elegance</span>
            </h2>
            <p className="text-[#b3aba1] text-sm mb-6">
              Follow the path of artistry and craftsmanship behind every Scentora creation. Each bottle captures a timeless story of luxury.
            </p>
            <div className="space-y-5">
              {[
                {
                  title: 'Crafted in Small Batches',
                  description: 'Every scent is blended with precision for a rich, long-lasting experience.',
                },
                {
                  title: 'Exquisite Ingredients',
                  description: 'A curated selection of rare oud, florals, and oriental spices.',
                },
                {
                  title: 'Designed for Elegance',
                  description: 'A bold luxury statement shaped for modern collectors.',
                },
              ].map((item) => (
                <div key={item.title} className="surface-panel p-5 rounded-[1.25rem] border border-secondary/10">
                  <p className="text-secondary uppercase tracking-[0.3em] mb-1 text-[10px]">{item.title}</p>
                  <p className="text-[#b3aba1] text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-panel p-10 rounded-[2rem] border border-secondary/15 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/12 via-transparent to-transparent"></div>
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="max-w-sm text-center">
                <div className="mb-6 inline-flex items-center justify-center rounded-full border border-secondary/20 bg-[#111111] w-24 h-24 mx-auto">
                  <span className="text-3xl gold-text">S</span>
                </div>
                <p className="text-[#b3aba1] text-sm mb-6">Scentora is crafted for those who seek a luxurious statement. Every detail is curated to feel like a private atelier.</p>
                <button className="btn-premium px-5 py-2.5 rounded-full text-sm">Discover the Collection</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
