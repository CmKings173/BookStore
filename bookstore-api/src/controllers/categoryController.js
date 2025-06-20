import { StatusCodes } from 'http-status-codes'
import { categoryService } from '~/services/categoryService'
import { ApiError } from '~/utils/ApiError'

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

const getCategories = async (req, res, next) => {
  try {
    const result = await categoryService.getCategories()
    res.json(result)
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await categoryService.deleteCategory(id)
    res.json(result)
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const categoryController = {
  createNew,
  getCategories,
  deleteCategory
}