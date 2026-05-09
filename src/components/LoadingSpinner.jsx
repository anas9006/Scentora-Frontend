import React from 'react'
import { motion } from 'framer-motion'

const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity }}
      className="w-12 h-12 border-4 border-secondary border-t-yellow-400 rounded-full"
    />
  </div>
)

export default LoadingSpinner
