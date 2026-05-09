import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock } from 'react-icons/fi'
import { toast } from 'react-toastify'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast.success('Your message has been sent to our concierge.')
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 1500)
  }

  const contactInfo = [
    {
      icon: <FiPhone />,
      title: 'Concierge Line',
      value: '+1 (888) SCENT-LUX',
      description: 'Available Mon-Fri, 9am-6pm EST',
    },
    {
      icon: <FiMail />,
      title: 'Email Us',
      value: 'concierge@scentora.com',
      description: 'We aim to respond within 24 hours',
    },
    {
      icon: <FiMapPin />,
      title: 'Flagship Atelier',
      value: '725 Luxury Row, Milan, Italy',
      description: 'Private viewings by appointment',
    },
    {
      icon: <FiClock />,
      title: 'Boutique Hours',
      value: '10:00 AM — 08:00 PM',
      description: 'Open daily for scent discovery',
    },
  ]

  return (
    <div className="min-h-screen pt-32 pb-20 luxury-gradient">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="text-secondary uppercase tracking-[0.5em] text-sm mb-4">Concierge Services</div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">Connect With <span className="gold-text gold-glow">Us</span></h1>
          <p className="max-w-2xl mx-auto text-muted text-lg leading-relaxed">
            Whether you seek a signature scent or require assistance with an order, our dedicated concierge team is here to provide an unparalleled experience.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-12 items-start">
          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="grid sm:grid-cols-2 gap-6"
          >
            {contactInfo.map((info, idx) => (
              <div key={idx} className="surface-panel p-8 rounded-3xl border border-secondary/5 hover:border-secondary/20 transition-all duration-300">
                <div className="text-3xl text-secondary mb-6">{info.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{info.title}</h3>
                <p className="text-secondary font-medium mb-2">{info.value}</p>
                <p className="text-muted text-xs uppercase tracking-widest">{info.description}</p>
              </div>
            ))}

            {/* Newsletter Shortcut */}
            <div className="sm:col-span-2 surface-panel p-10 rounded-[3rem] mt-6 bg-gradient-to-br from-secondary/10 to-transparent border border-secondary/10">
              <h3 className="text-2xl font-bold text-white mb-4">Join The Private List</h3>
              <p className="text-muted mb-6">Receive early access to limited editions and invitations to private olfactive events.</p>
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="Your luxury email..."
                  className="flex-1 bg-black/40 border border-secondary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition"
                />
                <button className="btn-premium px-6 py-3 rounded-xl">Join</button>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="surface-panel p-10 md:p-16 rounded-[4rem] border border-secondary/10"
          >
            <h2 className="text-3xl font-bold text-white mb-10">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-secondary transition"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-secondary transition"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-secondary transition appearance-none"
                >
                  <option className="bg-primary">General Inquiry</option>
                  <option className="bg-primary">Private Appointment</option>
                  <option className="bg-primary">Order Concierge</option>
                  <option className="bg-primary">Wholesale Partnership</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted">Your Message</label>
                <textarea
                  rows="5"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-secondary transition resize-none"
                  placeholder="How can we assist you today?"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-premium py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-transform hover:scale-[1.02]"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                ) : (
                  <>
                    <FiSend /> Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Contact
