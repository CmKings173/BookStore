import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],           // Các sản phẩm được chọn
  subtotal: 0,         // Tổng tiền hàng
  shippingFee: 0,      // Phí vận chuyển
  total: 0,            // Tổng cộng
  selectedItems: []    // ID các sản phẩm được chọn
}

export const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setCheckoutItems: (state, action) => {
      state.items = action.payload.items
      state.subtotal = action.payload.subtotal
      state.shippingFee = action.payload.shippingFee
      state.total = action.payload.total
      state.selectedItems = action.payload.selectedItems
    },
    clearCheckout: (state) => {
      state.items = []
      state.subtotal = 0
      state.shippingFee = 0
      state.total = 0
      state.selectedItems = []
    }
  }
})

export const { setCheckoutItems, clearCheckout } = checkoutSlice.actions
export default checkoutSlice.reducer
