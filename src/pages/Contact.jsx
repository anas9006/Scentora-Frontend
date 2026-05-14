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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const form = e.target
      const submitData = new FormData(form)
      submitData.append('access_key', '7c647ef8-4678-440f-9348-0b84229fe1a4')

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: submitData,
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Your message has been sent to our concierge.')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        toast.error(data.message || 'Failed to send message. Please try again.')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: <FiPhone />,
      title: 'Concierge Line',
      value: '+92-303-7015072',
      description: 'Available Mon-Fri, 9am-6pm EST',
    },
    {
      icon: <FiMail />,
      title: 'Email Us',
      value: 'scentora.support@gmail.com',
      description: 'We aim to respond within 24 hours',
    },
    {
      icon: <FiMapPin />,
      title: 'Flagship Atelier',
      value: '725 Tariq Building Main Sanda Road, Lahore, Pakistan',
      description: 'Private viewings by appointment',
    },
    {
      icon: <FiClock />,
      title: 'Boutique Hours',
      value: '10:00 AM - 08:00 PM',
      description: 'Open daily for scent discovery',
    },
  ]

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-10 md:pb-14 luxury-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-7 md:mb-10"
        >
          <div className="text-secondary uppercase tracking-[0.22em] md:tracking-[0.35em] text-[10px] md:text-xs mb-2 md:mb-3">
            Concierge Services
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-3">
            Connect With <span className="gold-text gold-glow">Us</span>
          </h1>
          <p className="max-w-xl mx-auto text-muted text-xs md:text-sm leading-relaxed">
            Whether you seek a signature scent or require assistance with an order, our dedicated concierge team is here to provide an unparalleled experience.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-5 md:gap-6 lg:gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 md:space-y-5 min-w-0"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {contactInfo.map((info) => (
                <div
                  key={info.title}
                  className="surface-panel p-4 rounded-xl md:rounded-2xl border border-secondary/5 hover:border-secondary/20 transition-all duration-300 min-w-0"
                >
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/10 text-lg text-secondary mb-3">
                    {info.icon}
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-white mb-1.5">{info.title}</h3>
                  <p className="text-secondary font-semibold text-xs md:text-sm mb-2 break-words">{info.value}</p>
                  <p className="text-muted text-[10px] uppercase tracking-[0.12em] leading-relaxed">
                    {info.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="surface-panel p-4 md:p-5 rounded-xl md:rounded-2xl bg-gradient-to-br from-secondary/10 to-transparent border border-secondary/10">
              <div className="flex flex-col xl:items-end gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1.5">Join The Private List</h3>
                  <p className="text-muted text-xs md:text-sm leading-relaxed">
                    Receive early access to limited editions and invitations to private olfactive events.
                  </p>
                </div>
                <div className="flex w-full flex-col sm:flex-row xl:w-auto gap-3">
                  <input
                    type="email"
                    placeholder="Your luxury email..."
                    className="w-full sm:min-w-[220px] xl:w-[220px] bg-black/40 border border-secondary/20 rounded-lg px-3 py-2.5 text-xs md:text-sm focus:outline-none focus:border-secondary transition"
                  />
                  <button className="btn-premium px-4 py-2.5 rounded-lg text-xs md:text-sm whitespace-nowrap">
                    Join
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="surface-panel p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl md:rounded-2xl border border-secondary/10 w-full min-w-0"
          >
            <h2 className="text-xl md:text-2xl font-bold text-white mb-5 md:mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-[0.14em] text-muted">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs md:text-sm focus:outline-none focus:border-secondary transition"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-[0.14em] text-muted">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs md:text-sm focus:outline-none focus:border-secondary transition"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-[0.14em] text-muted">Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs md:text-sm focus:outline-none focus:border-secondary transition appearance-none"
                >
                  <option className="bg-primary" value="">Select a subject...</option>
                  <option className="bg-primary" value="General Inquiry">General Inquiry</option>
                  <option className="bg-primary" value="Private Appointment">Private Appointment</option>
                  <option className="bg-primary" value="Order Concierge">Order Concierge</option>
                  <option className="bg-primary" value="Wholesale Partnership">Wholesale Partnership</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-[0.14em] text-muted">Your Message</label>
                <textarea
                  rows="5"
                  name="message"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs md:text-sm focus:outline-none focus:border-secondary transition resize-y min-h-[120px]"
                  placeholder="How can we assist you today?"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-premium py-3 md:py-3.5 rounded-lg font-bold text-xs md:text-sm flex items-center justify-center gap-2.5 transition-transform hover:scale-[1.01] disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
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
