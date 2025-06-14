import { useDispatch, useSelector } from 'react-redux'
import { fetchCartAPI, addToCartAPI, buyNow } from '~/redux/cart/cartSlice'
import { toast } from 'react-toastify'

export const useCart = () => {
  const dispatch = useDispatch()
  const { items, selectedItems, loading, error } = useSelector(state => state.cart)

  const fetchCart = async () => {
    try {
      await dispatch(fetchCartAPI()).unwrap()
    } catch (error) {
      toast.error('Không thể tải giỏ hàng')
      console.error('Fetch cart error:', error)
    }
  }

  const addToCart = async (bookId, quantity) => {
    try {
      await dispatch(addToCartAPI({ bookId, quantity })).unwrap()
      await fetchCart() // Fetch lại giỏ hàng sau khi thêm
      toast.success('Đã thêm vào giỏ hàng')
    } catch (error) {
      toast.error('Không thể thêm vào giỏ hàng')
    }
  }

  const handleBuyNow = async (bookId, quantity) => {
    try {
      await dispatch(buyNow({ bookId, quantity })).unwrap()
      await fetchCart() // Fetch lại giỏ hàng sau khi thêm
    } catch (error) {
      toast.error('Không thể mua ngay')
    }
  }

  return {
    items,
    selectedItems,
    error,
    fetchCart,
    addToCart,
    buyNow: handleBuyNow
  }
} 