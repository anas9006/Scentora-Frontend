import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { cartAPI, wishlistAPI } from './services/apiServices'
import { setCart } from './redux/cartSlice'
import { setWishlist } from './redux/wishlistSlice'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import VerifyEmail from './pages/Auth/VerifyEmail'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'
import AdminDashboard from './pages/Admin/AdminDashboard'
import Profile from './pages/Profile'
import Collections from './pages/Collections'
import About from './pages/About'
import Contact from './pages/Contact'
import OrderConfirmation from './pages/OrderConfirmation'
import Orders from './pages/Orders'
import OrderDetails from './pages/OrderDetails'
import ProductReviews from './pages/ProductReviews'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'

function App() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    const handleScroll = () => {
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const cartRes = await cartAPI.getCart()
          dispatch(setCart(cartRes.data.cart))
          const wishlistRes = await wishlistAPI.getWishlist()
          dispatch(setWishlist({ products: wishlistRes.data.wishlist.products }))
        } catch (error) {
          console.error('Error fetching user data', error)
        }
      }
      fetchUserData()
    }
  }, [user, dispatch])

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-dark text-light">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/product/:id/reviews" element={<ProductReviews />} />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-confirmation/:orderId"
              element={
                <ProtectedRoute>
                  <OrderConfirmation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order/:id"
              element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <ScrollToTop />
        <Footer />
        <ToastContainer autoClose={2000} />
      </div>
    </Router>
  )
}

export default App
