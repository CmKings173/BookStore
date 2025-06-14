import { StatusCodes } from 'http-status-codes'
import { cartService } from '~/services/cartService'
import { ApiError } from '~/utils/ApiError'


const getCartByUserId = async (req, res, next) => {
  try {
    // console.log('req.params: ', req.params )
    const userId = req.jwtDecoded._id
    // Điều hướng dữ liệu sang tầng Service
    const cart = await cartService.getCartByUserId(userId)
    // Có kết quả thì trả về phía client
    res.status(StatusCodes.OK).json(cart)

  } catch (error) {next(error)}
}

const addToCart = async (req, res, next) => {
  try {
    const { bookId, quantity } = req.body
    const userId = req.jwtDecoded._id

    if (!bookId || !quantity) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing required fields')
    }
    const result = await cartService.addToCart(userId, bookId, quantity)

    res.status(StatusCodes.OK).json({ result})
  } catch (error) {
    next(error)
  }
}

const removeFromCart = async (req, res, next) => {
  try {
    const { bookId } = req.body
    const userId = req.jwtDecoded._id
    const result = await cartService.removeFromCart(userId, bookId )
    res.status(StatusCodes.OK).json({ result })
  } catch (error) {
    next(error)
  }
}

const getTotalItems = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const result = await cartService.getTotalItems(userId)
    res.status(StatusCodes.OK).json({ result })
  } catch (error) {
    next(error)
  }
}

export const cartController = {
  getCartByUserId,
  addToCart,
  removeFromCart,
  getTotalItems
}