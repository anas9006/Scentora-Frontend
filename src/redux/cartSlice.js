import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0,
    itemCount: 0,
    loading: false,
  },
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload.items || []
      state.total = action.payload.totalPrice || 0
      state.itemCount = action.payload.items ? action.payload.items.reduce((total, item) => total + item.quantity, 0) : 0
    },
    addToCartSuccess: (state, action) => {
      state.items = action.payload.items || []
      state.total = action.payload.totalPrice || 0
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0)
    },
    removeFromCartSuccess: (state, action) => {
      state.items = action.payload.items || []
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0)
    },
    updateCartItemSuccess: (state, action) => {
      state.items = action.payload.items || []
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0)
    },
    clearCartSuccess: (state) => {
      state.items = []
      state.total = 0
      state.itemCount = 0
    },
  },
})

export const {
  setCart,
  addToCartSuccess,
  removeFromCartSuccess,
  updateCartItemSuccess,
  clearCartSuccess,
} = cartSlice.actions

export default cartSlice.reducer
