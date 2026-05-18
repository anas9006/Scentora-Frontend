import React from 'react'
import { motion } from 'framer-motion'
import { FiSettings, FiActivity, FiTarget, FiInfo } from 'react-icons/fi'

const Cookies = () => {
  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-16 luxury-gradient">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <div className="flex items-center justify-center gap-2 text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.32em] text-secondary mb-3">
            <span className="h-px w-8 bg-secondary rounded-full"></span>
            COOKIE PREFERENCES
            <span className="h-px w-8 bg-secondary rounded-full"></span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold gold-text gold-glow mb-4">
            Cookie Policy
          </h1>
          <p className="text-gray-400 text-xs md:text-sm">
            Last Updated: May 18, 2026
          </p>
        </motion.div>

        {/* Content Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="surface-panel rounded-2xl md:rounded-3xl border border-secondary/15 p-6 md:p-10 space-y-8 md:space-y-12"
        >
          {/* Welcome Message */}
          <div className="border-b border-white/5 pb-6">
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              At <strong>Scentora</strong>, we utilize cookies to offer you a personalized and premium sensory browsing experience. This Cookie Policy explains the classifications of cookies we utilize and how you can personalize your cookie settings.
            </p>
          </div>

          {/* Section 1: What are Cookies */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-secondary">
              <FiInfo size={20} />
              <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider">
                1. What are Cookies?
              </h2>
            </div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed pl-8">
              Cookies are small data blocks saved on your device's browser memory. They allow our website to remember your authentic session, cart selections, and preference parameters to ensure your navigation is fluid and highly luxurious.
            </p>
          </div>

          {/* Section 2: Essential Cookies */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-secondary">
              <FiSettings size={20} />
              <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider">
                2. Strictly Necessary Cookies
              </h2>
            </div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed pl-8">
              These cookies are mandatory to enable basic functionalities of Scentora, such as processing authentication, maintaining products in your luxury shopping cart, and securing checkout. The site cannot function properly without these cookies.
            </p>
          </div>

          {/* Section 3: Performance & Analytics */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-secondary">
              <FiActivity size={20} />
              <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider">
                3. Performance & Analytics Cookies
              </h2>
            </div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed pl-8">
              Performance cookies gather anonymous records concerning how visitors navigate the Scentora catalog. They help us discover high-performing products and pages, measure the success of luxury campaigns, and optimize visual responsiveness.
            </p>
          </div>

          {/* Section 4: Target & Advertising */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-secondary">
              <FiTarget size={20} />
              <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider">
                4. Custom Advertising Cookies
              </h2>
            </div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed pl-8">
              These cookies are used to build a profile of your olfactive preferences. They enable us to display tailor-made advertisements of our collections on partner platforms, ensuring you only receive announcements and offers matching your luxury taste.
            </p>
          </div>

          {/* Footer info inside card */}
          <div className="border-t border-white/5 pt-8 text-center text-xs md:text-sm text-gray-400">
            If you wish to configure or disable cookies, you can do so directly in your internet browser's preference panel. For any further details, reach us at <a href="mailto:scentora.support@gmail.com" className="gold-text hover:underline transition">concierge@scentora.com</a>.
          </div>

        </motion.div>

      </div>
    </div>
  )
}

export default Cookies
