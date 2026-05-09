import { createSlice } from '@reduxjs/toolkit'

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload.products || []
    },
    addToWishlistSuccess: (state, action) => {
      state.items = action.payload.products || []
    },
    removeFromWishlistSuccess: (state, action) => {
      state.items = action.payload.products || []
    },
  },
})

export const {
  setWishlist,
  addToWishlistSuccess,
  removeFromWishlistSuccess,
} = wishlistSlice.actions

export default wishlistSlice.reducer
