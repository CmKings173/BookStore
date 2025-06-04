import { StatusCodes } from 'http-status-codes'
import { categoryService } from '~/services/categoryService'

const createNew = async (req, res, next) => {
  try {
    // Điều hướng dữ liệu sang tầng Service
    const createdCategory = await categoryService.createNew(req.body)
    // Có kết quả thì trả về phía client
    res.status(StatusCodes.CREATED).json(createdCategory)
  }
  catch (error) {
    next(error)
  }
}

const getCategories = async(req, res, next) => {
  try {
    // Điều hướng dữ liệu sang tầng Service
    const result= await categoryService.getCategories()
    // Có kết quả thì trả về phía client
    res.status(StatusCodes.OK).json(result)
  }
  catch (error) {
    next(error)
  }
}

export const categoryController = {
  createNew,
  getCategories
}