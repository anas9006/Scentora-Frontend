import api from './api'

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.get('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  verifyEmail: (data) => api.post('/auth/verify-email', data),
  resendOTP: (email, type) => api.post('/auth/resend-otp', { email, type }),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
  updatePassword: (data) => api.put('/auth/me/password', data),
  getAllUsers: () => api.get('/auth/all-users'),
  getAllCustomers: () => api.get('/auth/all-customers'),
}

export const productAPI = {
  getAllProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  getFeaturedProducts: () => api.get('/products/featured'),
  createProduct: (data) => {
    if (data instanceof FormData) {
      return api.post('/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    }
    return api.post('/products', data)
  },
  updateProduct: (id, data) => {
    if (data instanceof FormData) {
      return api.put(`/products/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    }
    return api.put(`/products/${id}`, data)
  },
  deleteProduct: (id) => api.delete(`/products/${id}`),
}

export const categoryAPI = {
  getAllCategories: () => api.get('/categories'),
  getCategoryBySlug: (slug) => api.get(`/categories/${slug}`),
  createCategory: (data) => {
    if (data instanceof FormData) {
      return api.post('/categories', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    }
    return api.post('/categories', data)
  },
  updateCategory: (id, data) => {
    if (data instanceof FormData) {
      return api.put(`/categories/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    }
    return api.put(`/categories/${id}`, data)
  },
  deleteCategory: (id) => api.delete(`/categories/${id}`),
}

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart/add', data),
  removeFromCart: (itemId) => api.delete(`/cart/${itemId}`),
  updateCartItem: (itemId, data) => api.put(`/cart/${itemId}`, data),
  clearCart: () => api.delete('/cart'),
}

export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (data) => api.post('/wishlist/add', data),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),
}

export const orderAPI = {
  createOrder: (data) => api.post('/orders', data),
  getOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  getAllOrders: () => api.get('/orders/admin/all'),
  updateOrderStatus: (id, data) => api.put(`/orders/${id}/status`, data),
}

export const addressAPI = {
  getAddresses: () => api.get('/addresses'),
  createAddress: (data) => api.post('/addresses', data),
  updateAddress: (id, data) => api.put(`/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/addresses/${id}`),
  setPrimaryAddress: (id) => api.put(`/addresses/${id}/primary`),
}

export const reviewAPI = {
  createReview: (data) => api.post('/reviews', data),
  getProductReviews: (productId) => api.get(`/reviews/${productId}`),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
}

export default {
  authAPI,
  productAPI,
  categoryAPI,
  cartAPI,
  wishlistAPI,
  orderAPI,
  reviewAPI,
}
