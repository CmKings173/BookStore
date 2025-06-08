import { StatusCodes } from 'http-status-codes'
import { cartService } from '~/services/cartService'


const getCart = async (req, res, next) => {
  try {
    // console.log('req.params: ', req.params )
    const userId = req.jwtDecoded._id
    // Điều hướng dữ liệu sang tầng Service
    const cart = await cartService.getCart(userId)
    // Có kết quả thì trả về phía client
    res.status(StatusCodes.OK).json(cart)

  } catch (error) {next(error)}
}

export const cartController = {
  getCart
}