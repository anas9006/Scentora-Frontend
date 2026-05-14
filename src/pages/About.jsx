import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiAward, FiHeart, FiGlobe, FiZap } from 'react-icons/fi'

const About = () => {
  const stats = [
    { label: 'Years of Excellence', value: '15+' },
    { label: 'Signature Blends', value: '250+' },
    { label: 'Global Boutiques', value: '45' },
    { label: 'Award Wins', value: '12' },
  ]

  const features = [
    {
      icon: <FiAward />,
      title: 'Artisanal Craftsmanship',
      description: 'Every bottle is hand-poured and inspected by our master perfumers in our private atelier.',
    },
    {
      icon: <FiHeart />,
      title: 'Rare Ingredients',
      description: 'We source jasmine from Grasse, oud from Cambodia, and vanilla from Madagascar.',
    },
    {
      icon: <FiGlobe />,
      title: 'Sustainable Luxury',
      description: 'Recyclable glass, considered packaging, and ethically sourced materials guide each release.',
    },
    {
      icon: <FiZap />,
      title: 'Olfactive Innovation',
      description: 'We blend tradition with modern fragrance science to create scents that evolve on skin.',
    },
  ]

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-10 md:pb-14 luxury-gradient overflow-hidden">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 md:mb-14">
        <div className="grid lg:grid-cols-[1fr_0.9fr] gap-8 md:gap-10 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-secondary uppercase tracking-[0.22em] md:tracking-[0.35em] text-[10px] md:text-xs mb-3 md:mb-4 flex items-center gap-3">
              <span className="w-8 md:w-12 h-px bg-secondary"></span>
              Our Story
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              The Essence of <span className="gold-text gold-glow">Heritage</span>
            </h1>
            <p className="text-xs md:text-sm text-muted leading-relaxed mb-5 md:mb-6 max-w-2xl">
              Founded in the heart of Florence, Scentora began as a private atelier for the elite. Today, we continue that legacy by blending artisanal craft with modern precision to create fragrances that are not just smelled, but experienced.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="surface-panel rounded-xl border border-secondary/10 p-3 md:p-4">
                  <p className="text-xl md:text-2xl font-bold text-secondary mb-1">{stat.value}</p>
                  <p className="text-[9px] md:text-[10px] uppercase tracking-[0.14em] text-muted leading-relaxed">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] max-h-[520px] rounded-2xl md:rounded-3xl overflow-hidden border border-secondary/20 relative">
              <img
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000"
                alt="Perfumery Art"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="surface-panel p-4 md:p-5 rounded-2xl border border-secondary/10 mt-4 md:absolute md:-bottom-6 md:left-6 md:max-w-xs">
              <p className="italic text-secondary font-serif text-base md:text-lg mb-2">
                "Fragrance is the most intense form of memory."
              </p>
              <p className="text-[10px] text-muted uppercase tracking-[0.16em]">Alessandro V., Founder</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-black/40 py-10 md:py-14 border-y border-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              The Scentora <span className="gold-text">Philosophy</span>
            </h2>
            <div className="h-px w-20 bg-secondary mx-auto rounded-full"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="surface-panel p-4 md:p-5 rounded-xl md:rounded-2xl border border-secondary/5 hover:border-secondary/20 transition-all duration-300"
              >
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/10 text-lg text-secondary mb-3">
                  {feature.icon}
                </div>
                <h3 className="text-sm md:text-base font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-muted text-xs leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="surface-panel p-4 sm:p-5 md:p-8 rounded-xl md:rounded-2xl relative overflow-hidden border border-secondary/10">
          <div className="relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-6 md:gap-8 lg:gap-10 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">
                Looking Beyond the <span className="gold-text">Horizon</span>
              </h2>
              <p className="text-xs md:text-sm text-muted leading-relaxed mb-5 md:mb-6 max-w-2xl">
                Our vision is to redefine luxury for a new generation, where quality, authenticity, and sustainability are inseparable. We invite you to join us on this aromatic journey.
              </p>
              <Link to="/collections" className="btn-premium inline-flex px-5 py-3 rounded-lg text-xs md:text-sm font-bold">
                Discover Collections
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="aspect-square rounded-xl md:rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition duration-500">
                <img
                  src="https://thumbs.dreamstime.com/b/high-end-skincare-product-features-transparent-glass-bottle-gold-accents-surrounding-flowers-soft-light-enhance-its-luxurious-357016351.jpg?w=992"
                  alt="Luxury glass fragrance bottle"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-xl md:rounded-2xl overflow-hidden mt-8 md:mt-10 grayscale hover:grayscale-0 transition duration-500">
                <img
                  src="https://thumbs.dreamstime.com/b/elegant-perfume-bottle-luxurious-fabric-floral-background-beauty-design-generative-ai-sophisticated-glass-rests-453768283.jpg?w=992"
                  alt="Elegant perfume bottle with floral setting"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
