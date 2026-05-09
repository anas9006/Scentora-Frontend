import React from 'react'
import { Link } from 'react-router-dom'
import { FiFacebook, FiInstagram, FiTwitter, FiMail } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-primary border-t border-secondary/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold gold-text mb-4">Scentora</h3>
            <p className="text-[#b3aba1]">Experience luxury fragrances that define elegance and sophistication.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold gold-text mb-4">Quick Links</h4>
            <ul className="space-y-2 text-[#b3aba1]">
              <li><Link to="/" className="hover:text-secondary transition">Home</Link></li>
              <li><Link to="/shop" className="hover:text-secondary transition">Shop</Link></li>
              <li><Link to="/" className="hover:text-secondary transition">About</Link></li>
              <li><Link to="/" className="hover:text-secondary transition">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold gold-text mb-4">Customer Service</h4>
            <ul className="space-y-2 text-[#b3aba1]">
              <li><a href="#" className="hover:text-secondary transition">FAQ</a></li>
              <li><a href="#" className="hover:text-secondary transition">Shipping</a></li>
              <li><a href="#" className="hover:text-secondary transition">Returns</a></li>
              <li><a href="#" className="hover:text-secondary transition">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold gold-text mb-4">Newsletter</h4>
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 bg-[#121212] border border-secondary/20 rounded text-sm focus:outline-none"
              />
              <button className="btn-premium px-3 py-2 rounded text-sm">Subscribe</button>
            </div>
            <div className="flex space-x-4 mt-4 text-[#b3aba1]">
              <FiFacebook className="hover:text-secondary cursor-pointer" />
              <FiInstagram className="hover:text-secondary cursor-pointer" />
              <FiTwitter className="hover:text-secondary cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="border-t border-secondary/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#b3aba1]">&copy; 2024 Scentora. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0 text-[#b3aba1]">
              <a href="#" className="hover:text-secondary">Terms</a>
              <a href="#" className="hover:text-secondary">Privacy</a>
              <a href="#" className="hover:text-secondary">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
