import React from 'react'
import { motion } from 'framer-motion'
import { FiEye, FiLock, FiDatabase, FiUserCheck } from 'react-icons/fi'

const Privacy = () => {
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
            CONFIDENTIALITY
            <span className="h-px w-8 bg-secondary rounded-full"></span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold gold-text gold-glow mb-4">
            Privacy Policy
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
              At <strong>Scentora</strong>, we hold your personal confidentiality in the highest regard. This Privacy Policy details our practices concerning the collection, storage, and preservation of personal credentials during your premium shopping journey with us.
            </p>
          </div>

          {/* Section 1: Information Collection */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-secondary">
              <FiEye size={20} />
              <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider">
                1. Information We Collect
              </h2>
            </div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed pl-8">
              We collect credentials necessary to fulfill your luxury purchases and deliver custom recommendations. This includes identity details (first name, last name, phone number, and physical shipping address) along with transaction information.
            </p>
          </div>

          {/* Section 2: Data Encryption */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-secondary">
              <FiLock size={20} />
              <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider">
                2. Security & Encryption
              </h2>
            </div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed pl-8">
              Your security is our paramount priority. All communications between your browser and our backend servers are encrypted using Transport Layer Security (TLS/SSL). Personal data and passwords are secured behind robust cryptographic hash keys.
            </p>
          </div>

          {/* Section 3: Data Sharing */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-secondary">
              <FiDatabase size={20} />
              <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider">
                3. Third-Party Sharing
              </h2>
            </div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed pl-8">
              Scentora does not rent, sell, or disclose your personal records to third parties for sales or promotional usage. Data sharing is strictly confined to secure transactional networks (such as premium payment aggregators and dispatch delivery fleets).
            </p>
          </div>

          {/* Section 4: Your Rights */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-secondary">
              <FiUserCheck size={20} />
              <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider">
                4. Your Rights & Control
              </h2>
            </div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed pl-8">
              You maintain full ownership of your data. You have the right to request a complete export of your personal credentials or request absolute erasure of your account and personal history from our secure servers at any time.
            </p>
          </div>

          {/* Footer info inside card */}
          <div className="border-t border-white/5 pt-8 text-center text-xs md:text-sm text-gray-400">
            If you have questions regarding data preservation, please contact our concierge desk at <a href="mailto:scentora.support@gmail.com" className="gold-text hover:underline transition">privacy@scentora.com</a>.
          </div>

        </motion.div>

      </div>
    </div>
  )
}

export default Privacy
