import { createSlice } from '@reduxjs/toolkit'

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
    currentProduct: null,
    filteredProducts: [],
    pagination: {
      total: 0,
      page: 1,
      pages: 1,
    },
  },
  reducers: {
    fetchProductsStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchProductsSuccess: (state, action) => {
      state.loading = false
      state.items = action.payload.products
      state.pagination = action.payload.pagination
    },
    fetchProductsFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload
    },
    setFilteredProducts: (state, action) => {
      state.filteredProducts = action.payload
    },
  },
})

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  setCurrentProduct,
  setFilteredProducts,
} = productSlice.actions

export default productSlice.reducer
