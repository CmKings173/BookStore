import { StatusCodes } from 'http-status-codes'
import { cartService } from '~/services/cartService'

const createNew = async (req, res, next) => {
  try {
    // Điều hướng dữ liệu sang tầng Service
    const createdCard = await cartService.createNew(req.body)
    // Có kết quả thì trả về phía client
    res.status(StatusCodes.CREATED).json(createdCard)
  }
  catch (error) {
    next(error)
  }
}

export const cardController = {
  createNew
}