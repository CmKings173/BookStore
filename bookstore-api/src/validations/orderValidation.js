import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE, EMAIL_RULE_MESSAGE, EMAIL_RULE } from '~/utils/validators'

const createNewOrder = async (req, res, next) => {

  const ORDER_COLLECTION_SCHEMA = Joi.object({
    items: Joi.array().items(
      Joi.object({
        bookId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
        quantity: Joi.number().min(1).required()
          .messages({
            'number.base': 'Số lượng phải là số',
            'number.min': 'Số lượng phải lớn hơn 0',
            'any.required': 'Số lượng là bắt buộc'
          })
      }).unknown(false)
    ).min(1).required(),
    subtotal: Joi.number().required().min(0),
    shipping: Joi.number().min(0),
    totalAmount: Joi.number().required().min(0),
    shippingInfo: Joi.object({
      fullName: Joi.string().required()
        .messages({
          'string.empty': 'Họ tên không được để trống',
          'any.required': 'Họ tên là bắt buộc'
        }),
      email: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
      street: Joi.string().required()
        .messages({
          'string.empty': 'Đường không được để trống',
          'any.required': 'Đường là bắt buộc'
        }),
      ward: Joi.string().required()
        .messages({
          'string.empty': 'Phường/Xã không được để trống',
          'any.required': 'Phường/Xã là bắt buộc'
        }),
      district: Joi.string().required()
        .messages({
          'string.empty': 'Quận/Huyện không được để trống',
          'any.required': 'Quận/Huyện là bắt buộc'
        }),
      city: Joi.string().required()
        .messages({
          'string.empty': 'Thành phố không được để trống',
          'any.required': 'Thành phố là bắt buộc'
        }),
      phone: Joi.string().required()
        .messages({
          'string.empty': 'Số điện thoại không được để trống',
          'any.required': 'Số điện thoại là bắt buộc'
        }),
      note: Joi.string().max(1000).allow('', null).optional()
        .messages({
          'string.max': 'Ghi chú không được vượt quá 1000 ký tự'
        })
    }).required().unknown(false),
    paymentMethod: Joi.string().valid('COD', 'BANKING').required()
      .messages({
        'any.only': 'Phương thức thanh toán phải là COD hoặc BANKING',
        'any.required': 'Phương thức thanh toán là bắt buộc'
      }),
    status: Joi.string().valid(
      'pending',
      'confirmed',
      'shipping',
      'delivered',
      'cancelled'
    ).default('pending')
  })

  try {
    await ORDER_COLLECTION_SCHEMA.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ')
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage))
  }
}

const updateOrderStatus = async (req, res, next) => {

  const ORDER_COLLECTION_SCHEMA = Joi.object({
    status: Joi.string().valid(
      'pending',
      'confirmed',
      'shipping',
      'delivered',
      'cancelled'
    )
  })

  try {
    await ORDER_COLLECTION_SCHEMA.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    // const errorMessage = error.details.map(detail => detail.message).join(', ')
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY))
  }
}

export const orderValidation = {
  createNewOrder,
  updateOrderStatus
}
