import React from 'react'
import { Link } from 'react-router-dom'
import { FiFacebook, FiInstagram, FiTwitter, FiMail } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-primary border-t border-secondary/20 mt-12 md:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-8 md:mb-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-2xl md:text-3xl font-bold gold-text gold-glow mb-3 md:mb-4">Scentora</h3>
            <p className="text-[#b3aba1] text-sm md:text-base leading-relaxed max-w-md">
              Experience luxury fragrances that define elegance and sophistication.
            </p>
            <div className="flex gap-3 mt-5 text-[#b3aba1]">
              <a href="#" aria-label="Facebook" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-secondary/15 bg-white/5 hover:text-secondary hover:border-secondary/40 transition">
                <FiFacebook />
              </a>
              <a href="#" aria-label="Instagram" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-secondary/15 bg-white/5 hover:text-secondary hover:border-secondary/40 transition">
                <FiInstagram />
              </a>
              <a href="#" aria-label="Twitter" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-secondary/15 bg-white/5 hover:text-secondary hover:border-secondary/40 transition">
                <FiTwitter />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold gold-text mb-3 md:mb-4">Quick Links</h4>
            <ul className="grid gap-2.5 text-sm md:text-base text-[#b3aba1]">
              <li><Link to="/" className="inline-block py-1 hover:text-secondary transition">Home</Link></li>
              <li><Link to="/shop" className="inline-block py-1 hover:text-secondary transition">Shop</Link></li>
              <li><Link to="/about" className="inline-block py-1 hover:text-secondary transition">About</Link></li>
              <li><Link to="/contact" className="inline-block py-1 hover:text-secondary transition">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold gold-text mb-3 md:mb-4">Customer Service</h4>
            <ul className="grid gap-2.5 text-sm md:text-base text-[#b3aba1]">
              <li><a href="#" className="inline-block py-1 hover:text-secondary transition">FAQ</a></li>
              <li><a href="#" className="inline-block py-1 hover:text-secondary transition">Shipping</a></li>
              <li><a href="#" className="inline-block py-1 hover:text-secondary transition">Returns</a></li>
              <li><Link to="/privacy" className="inline-block py-1 hover:text-secondary transition">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="font-bold gold-text mb-3 md:mb-4">Newsletter</h4>
            <p className="text-[#b3aba1] text-sm mb-4 leading-relaxed">
              Get new releases and private offers in your inbox.
            </p>
            <form className="flex flex-col sm:flex-row lg:flex-col gap-2">
              <label className="sr-only" htmlFor="footer-email">Email address</label>
              <div className="relative flex-1">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={16} />
                <input
                  id="footer-email"
                  type="email"
                  placeholder="Your email"
                  className="w-full pl-9 pr-3 py-3 bg-[#121212] border border-secondary/20 rounded-lg text-sm focus:outline-none focus:border-secondary transition"
                />
              </div>
              <button type="submit" className="btn-premium px-4 py-3 rounded-lg text-xs md:text-sm flex-shrink-0">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-secondary/10 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="text-[#b3aba1] text-sm">&copy; 2024 Scentora. All rights reserved.</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#b3aba1]">
              <Link to="/terms" className="hover:text-secondary transition">Terms</Link>
              <Link to="/privacy" className="hover:text-secondary transition">Privacy</Link>
              <Link to="/cookies" className="hover:text-secondary transition">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
