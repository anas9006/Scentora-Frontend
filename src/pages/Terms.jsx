import React from 'react'
import { motion } from 'framer-motion'
import { FiShield, FiFileText, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi'

const Terms = () => {
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
            LEGAL AGREEMENT
            <span className="h-px w-8 bg-secondary rounded-full"></span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold gold-text gold-glow mb-4">
            Terms of Service
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
              Welcome to <strong>Scentora</strong>. These Terms of Service ("Terms") govern your access to and use of our website, services, and products. By purchasing from or interacting with Scentora, you agree to be bound by these Terms. Please read them carefully.
            </p>
          </div>

          {/* Section 1: Use of Service */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-secondary">
              <FiShield size={20} />
              <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider">
                1. Account & Security
              </h2>
            </div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed pl-8">
              To purchase Scentora fragrances, you may be required to register for an account. You are solely responsible for maintaining the confidentiality of your account credentials and password. Any actions performed through your account will be deemed your responsibility.
            </p>
          </div>

          {/* Section 2: Intellectual Property */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-secondary">
              <FiFileText size={20} />
              <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider">
                2. Intellectual Property Rights
              </h2>
            </div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed pl-8">
              All material, content, formulations, designs, graphics, brand identifiers, and trademarks listed on Scentora are the sole property of Scentora Luxury. You may not copy, reproduce, adapt, or redistribute any of Scentora’s intellectual property without explicit written consent.
            </p>
          </div>

          {/* Section 3: Orders, Pricing, and Payments */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-secondary">
              <FiRefreshCw size={20} />
              <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider">
                3. Orders, Pricing, & Formulations
              </h2>
            </div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed pl-8">
              All order pricing is displayed in local currencies. Scentora reserves the right to adjust formulations, pricing, and packaging without prior notice to preserve artisanal excellence. Scentora reserves the right to reject, limit, or cancel any luxury order.
            </p>
          </div>

          {/* Section 4: Limitation of Liability */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-secondary">
              <FiAlertTriangle size={20} />
              <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider">
                4. Liability Disclaimer
              </h2>
            </div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed pl-8">
              Scentora fragrances are formulated with exquisite raw materials. It is the buyer's responsibility to review ingredient details to prevent allergic reactions. Scentora shall not be liable for any indirect, incidental, or secondary damages arising out of the handling or wearing of our premium products.
            </p>
          </div>

          {/* Footer info inside card */}
          <div className="border-t border-white/5 pt-8 text-center text-xs md:text-sm text-gray-400">
            If you have questions regarding these Terms of Service, please consult our concierge via <a href="mailto:scentora.support@gmail.com" className="gold-text hover:underline transition">legal@scentora.com</a>.
          </div>

        </motion.div>

      </div>
    </div>
  )
}

export default Terms
