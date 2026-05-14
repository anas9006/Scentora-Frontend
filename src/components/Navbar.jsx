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
        <div className="flex justify-between items-center h-16 gap-3">
          {/* Left Side: Hamburger & Logo */}
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="lg:hidden hover:text-secondary focus:outline-none transition-colors flex-shrink-0"
            >
              {isOpen ? <FiX size={26} /> : <FiMenu size={26} />}
            </button>
            <Link to="/" className="flex-shrink-0">
              <div className="text-xl sm:text-2xl font-bold gold-text gold-glow">Scentora</div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-5 xl:space-x-8 text-sm text-gray-300">
            <Link to="/" className="hover:text-secondary transition">Home</Link>
            <Link to="/shop" className="hover:text-secondary transition">Shop</Link>
            <Link to="/collections" className="hover:text-secondary transition">Collections</Link>
            <Link to="/about" className="hover:text-secondary transition">About</Link>
            <Link to="/contact" className="hover:text-secondary transition">Contact</Link>
          </div>

          {/* Right Side Actions: Profile, Wishlist, Cart */}
          <div className="flex items-center space-x-3 lg:space-x-4 xl:space-x-5 flex-shrink-0">
            {/* Desktop Search */}
            <div className="hidden xl:block relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#121212] border border-secondary/20 rounded px-3 py-2 text-sm w-40 focus:outline-none focus:border-secondary transition-all"
              />
              <FiSearch className="absolute right-3 top-3 text-secondary cursor-pointer" />
            </div>

            {/* Profile Link/Dropdown */}
            <div ref={profileRef} className="relative">
              {user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileOpen((prev) => !prev)}
                    className="flex items-center hover:text-secondary transition"
                  >
                    <FiUser size={24} />
                    <span className="hidden xl:inline ml-2 text-sm">{user.firstName}</span>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-primary border border-secondary/20 rounded shadow-2xl overflow-hidden">
                      <Link to="/profile" onClick={() => setProfileOpen(false)} className="block px-4 py-2 hover:bg-[#111111] transition-colors">Profile</Link>
                      {user.role === 'customer' && (
                        <Link to="/order" onClick={() => setProfileOpen(false)} className="block px-4 py-2 hover:bg-[#111111] transition-colors">Orders</Link>
                      )}
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setProfileOpen(false)} className="block px-4 py-2 hover:bg-[#111111] transition-colors">Admin Pannel</Link>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false)
                          handleLogout()
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-[#111111] transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="hover:text-secondary transition">
                  <FiUser size={24} />
                </Link>
              )}
            </div>

            {/* Wishlist Link */}
            <Link to="/wishlist" className="relative hover:text-secondary transition">
              <FiHeart size={24} className="md:w-5 md:h-5" />
              {wishlistItems && wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-primary rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link to="/cart" className="relative hover:text-secondary transition">
              <FiShoppingCart size={24} className="md:w-6 md:h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-primary rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden pb-4 border-t border-secondary/10 pt-4 space-y-2"
          >
            <Link to="/" onClick={() => setIsOpen(false)} className="block py-2 text-gray-300 hover:text-secondary transition">Home</Link>
            <Link to="/shop" onClick={() => setIsOpen(false)} className="block py-2 text-gray-300 hover:text-secondary transition">Shop</Link>
            <Link to="/collections" onClick={() => setIsOpen(false)} className="block py-2 text-gray-300 hover:text-secondary transition">Collections</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="block py-2 text-gray-300 hover:text-secondary transition">About</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="block py-2 text-gray-300 hover:text-secondary transition">Contact</Link>
            {!user && <Link to="/login" onClick={() => setIsOpen(false)} className="block py-2 text-gray-300 hover:text-secondary transition">Login</Link>}
          </motion.div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
