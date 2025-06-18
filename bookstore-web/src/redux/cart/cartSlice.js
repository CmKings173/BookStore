
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

const initialState = {
  items: [],
  selectedItems: [],
  loading: false,
  error: null,
  totalItems: 0  
}

export const fetchCartAPI = createAsyncThunk(
  'cart/fetchCartAPI',
  async () => {
    try {
      const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/carts`)
      // console.log('Cart API Response:', response.data)
      return response.data
    } catch (error) {
      // console.error('Cart API Error:', error)
      throw error
    }
  }
)

export const addToCartAPI = createAsyncThunk(
  'cart/addToCartAPI',
  async ({ bookId, quantity }, { dispatch }) => {
    try {
      const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/carts`, {
        bookId,
        quantity
      })
      // console.log('Add to Cart API Response:', response.data)
      // Fetch cart after adding item
      await dispatch(fetchCartAPI())
      return response.data
    } catch (error) {
      // console.error('Add to Cart API Error:', error)
      throw error
    }
  }
)

export const buyNow = createAsyncThunk(
  'cart/buyNow',
  async ({ bookId, quantity }, { dispatch }) => {
    try {
      const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/carts`, {
        bookId,
        quantity
      })
      // Fetch cart after adding item
      await dispatch(fetchCartAPI())
      return response.data
    } catch (error) {
      // console.error('Add to Cart API Error:', error)
      throw error
    }
  }
)


export const removeFromCartAPI = createAsyncThunk(
  'cart/removeFromCartAPI',
  async (bookId) => {
    try {
      const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/carts`, {
        data: { bookId }
      })
      return response.data
    } catch (error) {
      throw error
    }
  }
)

export const fetchTotalItemsAPI = createAsyncThunk(
  'cart/total',
  async () => {
    try {
      const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/carts/total`)
      return response.data
    } catch (error) {
      throw error
    }
  }
)

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setSelectedItems: (state, action) => {
      state.selectedItems = action.payload
    },
    updateQuantity: (state, action) => {
      const { bookId, quantity } = action.payload
      const item = state.items.find(item => item.bookId === bookId)
      if (item) {
        item.quantity = Math.min(quantity, item.maxQuantity)
      }
    },
    toggleSelectItem: (state, action) => {
      const bookId = action.payload
      const index = state.selectedItems.indexOf(bookId)
      if (index === -1) {
        state.selectedItems.push(bookId)
      } else {
        state.selectedItems.splice(index, 1)
      }
    },
    toggleSelectAll: (state) => {
      const inStockItems = state.items.filter(item => item.inStock)
      const inStockIds = inStockItems.map(item => item.bookId)
      const allInStockSelected = inStockIds.every(id => state.selectedItems.includes(id))
      
      if (allInStockSelected) {
        state.selectedItems = []
      } else {
        state.selectedItems = inStockIds
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartAPI.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCartAPI.fulfilled, (state, action) => {
        state.loading = false
        // console.log('Cart API Payload:', action.payload)
        
        if (action.payload && action.payload.items) {
          // Transform cart items to match the UI structure
          state.items = action.payload.items.map(item => {
            // console.log('Processing item:', item)
            return {
              id: item.bookId,
              bookId: item.bookId,
              title: item.title,
              author: item.author,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
              inStock: item.inStock,
              maxQuantity: item.stock,
              publisher: item.publisher,
              publishYear: item.publishYear,
              pages: item.pages
            }
          })
          
          // Tự động chọn các sản phẩm còn hàng
          const inStockItems = state.items
            .filter(item => item.inStock)
            .map(item => item.id)
          state.selectedItems = inStockItems
          
          // console.log('Final transformed items:', state.items)
          // console.log('Selected items:', state.selectedItems)
        } else {
          console.log('No items in cart payload')
          state.items = []
          state.selectedItems = []
        }
      })
      .addCase(fetchCartAPI.rejected, (state, action) => {
        state.loading = false
        state.error = action.error?.message || 'Failed to fetch cart'
        console.error('Cart API Error:', action.error)
      })

      .addCase(addToCartAPI.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addToCartAPI.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(addToCartAPI.rejected, (state, action) => {
        state.loading = false
        state.error = action.error?.message || 'Failed to add item to cart'
      })

      .addCase(buyNow.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(buyNow.rejected, (state, action) => {
        state.loading = false
        state.error = action.error?.message || 'Failed to buy now'
      })
      

      .addCase(removeFromCartAPI.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(removeFromCartAPI.rejected, (state, action) => {
        state.loading = false
        state.error = action.error?.message || 'Failed to remove item from cart'
      })

      .addCase(fetchTotalItemsAPI.fulfilled, (state, action) => {
        state.loading = false
        state.totalItems = action.payload.result
      })
  }
})

// Selectors
export const selectCartItems = (state) => state.cart.items
export const selectSelectedItems = (state) => state.cart.selectedItems
export const selectCartLoading = (state) => state.cart.loading
export const selectCartError = (state) => state.cart.error

export const {
  setSelectedItems,
  updateQuantity,
  removeItem,
  toggleSelectItem,
  toggleSelectAll
} = cartSlice.actions

export const cartReducer = cartSlice.reducer 