import React from 'react'
import { motion } from 'framer-motion'
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
      description: 'We source the worlds finest jasmine from Grasse, oud from Cambodia, and vanilla from Madagascar.',
    },
    {
      icon: <FiGlobe />,
      title: 'Sustainable Luxury',
      description: 'Our commitment to the Earth is as strong as our scents. 100% recyclable glass and ethically sourced materials.',
    },
    {
      icon: <FiZap />,
      title: 'Olfactive Innovation',
      description: 'Pioneering molecular fragrance technology to create scents that evolve uniquely on your skin.',
    },
  ]

  return (
    <div className="min-h-screen pt-32 pb-20 luxury-gradient overflow-hidden">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 mb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-secondary uppercase tracking-[0.4em] text-sm mb-6 flex items-center gap-4">
              <span className="w-12 h-px bg-secondary"></span>
              Our Story
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8">
              The Essence of <span className="gold-text gold-glow">Heritage</span>
            </h1>
            <p className="text-lg text-muted leading-relaxed mb-8">
              Founded in the heart of Florence, Scentora began as a private atelier for the elite. Our mission was simple: to capture the intangible beauty of memory in a bottle.
            </p>
            <p className="text-lg text-muted leading-relaxed mb-12">
              Today, we continue that legacy, blending traditional artisanal methods with modern scientific precision to create fragrances that are not just smelled, but experienced.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx}>
                  <p className="text-3xl font-bold text-secondary mb-1">{stat.value}</p>
                  <p className="text-xs uppercase tracking-widest text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-secondary/20 relative">
              <img
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000"
                alt="Perfumery Art"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="absolute -bottom-10 -left-10 surface-panel p-8 rounded-3xl border border-secondary/10 hidden md:block max-w-xs">
              <p className="italic text-secondary font-serif text-xl mb-4">"Fragrance is the most intense form of memory."</p>
              <p className="text-sm text-muted uppercase tracking-widest">— Alessandro V., Founder</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-black/40 py-24 border-y border-secondary/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">The Scentora <span className="gold-text">Philosophy</span></h2>
            <div className="h-1 w-24 bg-secondary mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="surface-panel p-8 rounded-3xl border border-secondary/5 hover:border-secondary/20 transition-all duration-300"
              >
                <div className="text-4xl text-secondary mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="max-w-7xl mx-auto px-4 py-32">
        <div className="surface-panel p-12 md:p-20 rounded-[4rem] relative overflow-hidden border border-secondary/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full"></div>
          <div className="relative z-10 grid lg:grid-cols-[1.2fr_0.8fr] gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Looking Beyond the <span className="gold-text">Horizon</span></h2>
              <p className="text-xl text-muted leading-relaxed mb-10">
                Our vision is to redefine luxury for a new generation. One where quality, authenticity, and sustainability are inseparable. We invite you to join us on this aromatic journey.
              </p>
              <button className="btn-premium px-10 py-4 rounded-full font-bold">Discover Collections</button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="aspect-square rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition duration-500">
                <img src="https://thumbs.dreamstime.com/b/high-end-skincare-product-features-transparent-glass-bottle-gold-accents-surrounding-flowers-soft-light-enhance-its-luxurious-357016351.jpg?w=992" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square rounded-3xl overflow-hidden mt-12 grayscale hover:grayscale-0 transition duration-500">
                <img src="https://thumbs.dreamstime.com/b/elegant-perfume-bottle-luxurious-fabric-floral-background-beauty-design-generative-ai-sophisticated-glass-rests-453768283.jpg?w=992" alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
