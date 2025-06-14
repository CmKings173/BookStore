import { cartModel } from '~/models/cartModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { bookModel } from '~/models/bookModel'


const getCartByUserId = async (userId) => {
  try {
    const result = await cartModel.getCartByUserId(userId)
    return result
  } catch (error) { throw new Error(error)}
}

const addToCart = async (userId, bookId, quantity) => {
  try {
    // Kiểm tra sách có tồn tại không
    const book = await bookModel.findOneById(bookId)
    if (!book) {
      throw new Error('Book not found')
    }

    // Kiểm tra số lượng tồn kho
    if (book.stock < quantity) {
      throw new Error('Not enough stock')
    }
    // Thêm vào giỏ hàng
    const result = await cartModel.addToCart(userId, bookId, quantity)

    if (!result) {
      throw new Error('Failed to add to cart')
    }

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const removeFromCart = async (userId, bookId) => {
  try {
    const result = await cartModel.removeFromCart(userId, bookId)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getTotalItems = async (userId) => {
  try {
    const result = await cartModel.getTotalItems(userId)
    return result
  } catch (error) {
    throw new Error(error)
  }
}


export const cartService = {
  getCartByUserId,
  addToCart,
  removeFromCart,
  getTotalItems
}