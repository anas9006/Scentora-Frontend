import React from 'react'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiHeart } from 'react-icons/fi'
import { useSelector } from 'react-redux'

const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => {
  const [isAddingToCart, setIsAddingToCart] = React.useState(false)
  const wishlistItems = useSelector((state) => state.wishlist.items)

  const getProductId = (item) => item?._id || item?.product?._id || item?.product || item
  const isWishlisted = wishlistItems.some((item) => String(getProductId(item)) === String(product._id))

  const discountPercentage = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-primary border border-secondary rounded-lg overflow-hidden group"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden h-60 bg-gray-800">
        <img
          src={product.images[0]?.url || 'https://via.placeholder.com/300x300'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-secondary text-primary px-2 py-1 rounded text-xs font-bold">
            -{discountPercentage}%
          </div>
        )}

        {/* Overlay Actions (Desktop) */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition hidden md:flex items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={async () => {
              setIsAddingToCart(true)
              await onAddToCart()
              setIsAddingToCart(false)
            }}
            disabled={isAddingToCart}
            className="bg-secondary text-primary p-3 rounded-full hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddingToCart ? (
              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            ) : (
              <FiShoppingCart size={20} />
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={onAddToWishlist}
            className={`p-3 rounded-full transition ${isWishlisted ? 'bg-red-600' : 'bg-secondary text-primary hover:bg-yellow-400'}`}
          >
            <FiHeart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
          </motion.button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-secondary text-xs mb-1">{product.brand}</p>
        <h3 className="text-white font-semibold mb-2 line-clamp-2">{product.name}</h3>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
          <span className="text-gray-400 text-xs ml-2">({product.rating || 0})</span>
        </div>

        {/* Price and Mobile Actions */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            <span className="text-secondary font-bold">${product.discountPrice || product.price}</span>
            {product.discountPrice && (
              <span className="text-gray-500 text-sm line-through">${product.price}</span>
            )}
          </div>
          
          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={async () => {
                setIsAddingToCart(true)
                await onAddToCart()
                setIsAddingToCart(false)
              }}
              disabled={isAddingToCart}
              className="bg-secondary text-primary p-2 rounded-full hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingToCart ? (
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              ) : (
                <FiShoppingCart size={16} />
              )}
            </button>
            <button
              onClick={onAddToWishlist}
              className={`p-2 rounded-full transition ${isWishlisted ? 'bg-red-600' : 'bg-[#111111] border border-secondary/20 text-gray-300'}`}
            >
              <FiHeart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard
