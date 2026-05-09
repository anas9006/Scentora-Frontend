import React, { useEffect } from 'react'
import { FiArrowUp } from 'react-icons/fi'
import { motion } from 'framer-motion'

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = React.useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 bg-secondary text-primary p-3 rounded-full hover:bg-yellow-400 transition shadow-lg"
        >
          <FiArrowUp size={24} />
        </motion.button>
      )}
    </>
  )
}

export default ScrollToTop
