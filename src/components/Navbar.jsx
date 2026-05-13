import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {logout} from '../redux/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { authAPI } from '../services/apiServices'
import { FiSearch, FiShoppingCart, FiHeart, FiUser, FiMenu, FiX } from 'react-icons/fi'
import { motion } from 'framer-motion'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const profileRef = useRef(null)
  const { user, token } = useSelector((state) => state.auth)
  const { itemCount } = useSelector((state) => state.cart)
  const { items: wishlistItems } = useSelector((state) => state.wishlist)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const handleLogout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      dispatch(logout())
      setProfileOpen(false)
      navigate('/login')
    }
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass border-b border-secondary/10 shadow-xl' : 'bg-primary/90'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="text-2xl font-bold gold-text gold-glow">Scentora</div>
          </Link>

          <div className="hidden md:flex items-center space-x-8 text-sm text-gray-300">
            <Link to="/" className="hover:text-secondary transition">Home</Link>
            <Link to="/shop" className="hover:text-secondary transition">Shop</Link>
            <Link to="/collections" className="hover:text-secondary transition">Collections</Link>
            <Link to="/about" className="hover:text-secondary transition">About</Link>
            <Link to="/contact" className="hover:text-secondary transition">Contact</Link>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#121212] border border-secondary/20 rounded px-3 py-2 text-sm w-40 focus:outline-none focus:border-secondary"
              />
              <FiSearch className="absolute right-3 top-3 text-secondary cursor-pointer" />
            </div>

            <Link to="/wishlist" className="relative hover:text-secondary transition">
              <FiHeart size={20} />
              {wishlistItems && wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative hover:text-secondary transition">
              <FiShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div ref={profileRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center space-x-2 hover:text-secondary transition"
                >
                  <FiUser size={20} />
                  <span>{user.firstName}</span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-primary border border-secondary/20 rounded shadow-2xl">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-[#111111]">Profile</Link>
                    {user.role === 'customer' && (
                      <Link to="/order" className="block px-4 py-2 hover:bg-[#111111]">Orders</Link>
                    )}
                    {user.role === 'admin' && (
                      <Link to="/admin" className="block px-4 py-2 hover:bg-[#111111]">Admin Pannel</Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-[#111111]"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-premium px-4 py-2 rounded">Login</Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/wishlist" className="relative hover:text-secondary transition">
              <FiHeart size={24} />
              {wishlistItems && wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative hover:text-secondary transition">
              <FiShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="hover:text-secondary">
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden pb-4 border-t border-secondary/10 pt-4 space-y-2"
          >
            <Link to="/" className="block py-2 text-gray-300 hover:text-secondary transition">Home</Link>
            <Link to="/shop" className="block py-2 text-gray-300 hover:text-secondary transition">Shop</Link>
            <Link to="/collections" className="block py-2 text-gray-300 hover:text-secondary transition">Collections</Link>
            <Link to="/about" className="block py-2 text-gray-300 hover:text-secondary transition">About</Link>
            <Link to="/contact" className="block py-2 text-gray-300 hover:text-secondary transition">Contact</Link>
            {!user && <Link to="/login" className="block py-2 text-gray-300 hover:text-secondary transition">Login</Link>}
          </motion.div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
