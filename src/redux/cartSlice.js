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
      state.itemCount = action.payload.items ? action.payload.items.length : 0
    },
    addToCartSuccess: (state, action) => {
      state.items = action.payload.items || []
      state.total = action.payload.totalPrice || 0
      state.itemCount = state.items.length
    },
    removeFromCartSuccess: (state, action) => {
      state.items = action.payload.items || []
      state.itemCount = state.items.length
    },
    updateCartItemSuccess: (state, action) => {
      state.items = action.payload.items || []
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
