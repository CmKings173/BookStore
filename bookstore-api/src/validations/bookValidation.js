import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'


const createNew = async (req, res, next) => {

  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(100).trim().strict().messages({
      'any.required': 'Title is required',
      'string.empty': 'Title cannot be empty',
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title must be less than or equal to 100 characters long'
    }),
    author: Joi.string().required().min(3).max(100).trim().strict().messages({
      'any.required': 'Author is required',
      'string.empty': 'Author cannot be empty'
    }),
    subtitle: Joi.string().optional().max(255).trim().strict(),
    description: Joi.string().optional().max(5000).trim().strict(),
    price: Joi.number().required().min(0).messages({
      'any.required': 'Price is required',
      'number.base': 'Price must be a number',
      'number.min': 'Price must be greater than or equal to 0'
    }),
    categoryId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    stock: Joi.number().required().min(0).messages({
      'any.required': 'Stock is required',
      'number.base': 'Stock must be a number',
      'number.min': 'Stock must be at least 0'
    }),
    publisher: Joi.string().required().min(2).max(100).trim().strict().messages({
      'any.required': 'Publisher is required'
    }),
    publishYear: Joi.string()
      .pattern(/^\d{4}$/)
      .required()
      .messages({
        'any.required': 'Publish year is required',
        'string.pattern.base': 'Publish year must be a 4-digit number'
      }),
    pages: Joi.number().required().min(1).messages({
      'any.required': 'Pages are required',
      'number.base': 'Pages must be a number',
      'number.min': 'Pages must be at least 1'
    }),
    format: Joi.string().optional(),
    dimensions:Joi.string().optional().trim().strict(),
    weight:Joi.number().optional().min(1),
    image:Joi.string().default(null),
    inStock: Joi.boolean().required().default((parent) => parent.stock > 0)
  })

  try {
    // Validate dữ liệu nhận được từ FE
    // Set abortEarly: false để trường hợp có nhiều lỗi validation thì trả về tất cả lỗi
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // Validate dữ liệu xong thì cho request đi tiếp sang controller
    next()
  } catch (error) {

    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const updateBook = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(100).trim().strict(),
    author: Joi.string().min(3).max(100).trim().strict(),
    subtitle: Joi.string().max(255).trim().strict(),
    description: Joi.string().max(5000).trim().strict(),
    price: Joi.number().min(0),
    categoryId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    stock: Joi.number().min(0),
    publisher: Joi.string().min(2).max(100).trim().strict(),
    publishYear: Joi.string().pattern(/^\d{4}$/),
    pages: Joi.number().min(1),
    format: Joi.string().optional(),
    dimensions:Joi.string().optional().trim().strict(),
    weight:Joi.number().optional().min(1),
    inStock: Joi.boolean().required().default((parent) => parent.stock > 0)
  })
  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true
    })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const deleteBook = async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  })

  try {
    await correctCondition.validateAsync(req.params)
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}
export const bookValidation = {
  createNew,
  deleteBook,
  updateBook
}