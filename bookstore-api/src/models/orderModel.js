/* eslint-disable no-unused-vars */
import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE } from '~/utils/validators'
import { bookModel } from './bookModel'
import { cartModel } from './cartModel'
import { ApiError } from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
// Define collection (Name & Schema)
const ORDER_COLLECTION_NAME = 'orders'

// const createIndexes = async () => {
//   try {
//     await GET_DB().collection(ORDER_COLLECTION_NAME).createIndex({ userId: 1 })
//     await GET_DB().collection(ORDER_COLLECTION_NAME).createIndex({ status: 1 })
//     await GET_DB().collection(ORDER_COLLECTION_NAME).createIndex({ createdAt: -1 })
//     // console.log('Created indexes for orders collection')
//   } catch (error) {
//     console.error('Error creating indexes:', error)
//   }
// }

// Gọi hàm tạo index khi module được load
// createIndexes()

const ORDER_COLLECTION_SCHEMA = Joi.object({
  userId:Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  items: Joi.array().items(
    Joi.object({
      bookId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
      quantity: Joi.number().min(1).required()
    })
  ).min(1).required(),
  subtotal: Joi.number().required().min(0),
  shipping: Joi.number().min(0),
  totalAmount: Joi.number().required().min(0),
  shippingInfo: Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    street: Joi.string().required(),
    ward: Joi.string().required(),
    district: Joi.string().required(),
    city: Joi.string().required(),
    phone: Joi.string().required(),
    note: Joi.string().max(1000).allow('', null).optional()
  }).required(),
  paymentMethod: Joi.string().valid('COD', 'BANKING').required(),
  status: Joi.string().valid(
    'pending', // Chờ xác nhận
    'confirmed', // Đã xác nhận/đang xử lý
    'shipping', // Đang giao
    'delivered', // Đã giao
    'cancelled' // Hủy đơn
  ).default('pending'),
  isPaid: Joi.boolean().default(false),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

// Chỉ định field không được update
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

// const categoryId = categoryModel.findOneById('683dbf0b81f5b0715b0df7f5')
const validateBeforeCreate = async (data) => {
  return await ORDER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

// Tạo mới order
const createNewOrder = async (data) => {
  try {
    const session = GET_DB().client.startSession()
    try {
      await session.withTransaction(async () => {
        const validData = await validateBeforeCreate(data)
        validData.userId = new ObjectId(validData.userId)
        // Chuyển đổi bookId thành ObjectId cho mỗi item
        validData.items = validData.items.map(item => ({
          ...item,
          bookId: new ObjectId(item.bookId)
        }))

        // Tạo đơn hàng mới
        const result = await GET_DB().collection(ORDER_COLLECTION_NAME).insertOne(validData, { session })

        // Lấy giỏ hàng hiện tại
        const cart = await GET_DB().collection(cartModel.CART_COLLECTION_NAME).findOne({ userId: validData.userId }, { session })
        if (cart) {
          // Lọc ra những sách chưa được đặt
          const remainingItems = cart.items.filter(cartItem =>
            !validData.items.some(orderItem =>
              orderItem.bookId.toString() === cartItem.bookId.toString()
            )
          )

          // Cập nhật giỏ hàng với những sách còn lại
          await GET_DB().collection('carts').updateOne(
            { userId: validData.userId },
            {
              $set: {
                items: remainingItems,
                updatedAt: new Date()
              }
            },
            { session }
          )
        }

        return result
      })
    } finally {
      await session.endSession()
    }
  } catch (error) {
    throw new Error(error)
  }
}

// Tìm đơn hàng theo ID
const findOrderById = async (orderId) => {
  try {
    return await GET_DB().collection(ORDER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(orderId) })
  } catch (error) {
    throw new Error(error)
  }
}

// Tìm đơn hàng theo userId
const findOrdersByUserId = async (userId) => {
  try {
    return await GET_DB().collection(ORDER_COLLECTION_NAME)
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray()
  } catch (error) {
    throw new Error(error)
  }
}

// Tìm đơn hàng theo trạng thái
const findOrdersByStatus = async (status) => {
  try {
    return await GET_DB().collection(ORDER_COLLECTION_NAME)
      .find({ status: status })
      .sort({ createdAt: -1 })
      .toArray()
  } catch (error) {
    throw new Error(error)
  }
}

// Tìm đơn hàng theo khoảng thời gian
const findOrdersByDateRange = async (startDate, endDate) => {
  try {
    return await GET_DB().collection(ORDER_COLLECTION_NAME)
      .find({
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      })
      .sort({ createdAt: -1 })
      .toArray()
  } catch (error) {
    throw new Error(error)
  }
}

// Tìm đơn hàng của user theo trạng thái
const findUserOrdersByStatus = async (userId, status) => {
  try {
    return await GET_DB().collection(ORDER_COLLECTION_NAME)
      .find({
        userId: new ObjectId(userId),
        status: status
      })
      .sort({ createdAt: -1 })
      .toArray()
  } catch (error) {
    throw new Error(error)
  }
}

// Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (orderId, status) => {
  try {
    const session = GET_DB().client.startSession()
    try {
      await session.withTransaction(async () => {
        const order = await GET_DB().collection(ORDER_COLLECTION_NAME)
          .findOne({ _id: new ObjectId(orderId) }, { session })
        if (!order) {
          throw new Error('Không tìm thấy đơn hàng')
        }

        // Define allowed status transitions
        const allowedTransitions = {
          'pending': ['confirmed', 'cancelled'],
          'confirmed': ['shipping', 'cancelled'],
          'shipping': ['delivered', 'cancelled'],
          'delivered': [],
          'cancelled': []
        }

        const currentStatus = order.status
        console.log('currentStatus: ', currentStatus)
        const newStatus = status

        if (!allowedTransitions[currentStatus] || !allowedTransitions[currentStatus].includes(newStatus)) {
          throw new ApiError(StatusCodes.BAD_REQUEST, `Không thể chuyển đổi trạng thái từ '${currentStatus}' sang '${newStatus}'`)
        }

        // Nếu trạng thái mới là 'confirmed', cập nhật số lượng sách
        if (newStatus === 'confirmed') {
          for (const item of order.items) {
            const book = await GET_DB().collection('books').findOne({ _id: item.bookId }, { session })
            if (!book) {
              throw new Error(`Không tìm thấy sách với id ${item.bookId}`)
            }
            if (book.stock < item.quantity) {
              throw new Error(`Không đủ số lượng tồn kho cho sách ${book.title}`)
            }
            await GET_DB().collection('books').updateOne(
              { _id: item.bookId },
              {
                $inc: { stock: -item.quantity },
                $set: {
                  inStock: book.stock - item.quantity > 0,
                  updatedAt: new Date()
                }
              },
              { session }
            )
          }
        }

        if (newStatus === 'delivered') {
          if (!order.isPaid) { // Đảm bảo chỉ cập nhật nếu chưa thanh toán
            await GET_DB().collection(ORDER_COLLECTION_NAME).updateOne(
              { _id: new ObjectId(orderId) },
              {
                $set: {
                  isPaid: true,
                  updatedAt: new Date()
                }
              },
              { session }
            )
          }
        }

        // Cập nhật trạng thái đơn hàng
        const result = await GET_DB().collection(ORDER_COLLECTION_NAME)
          .updateOne(
            { _id: new ObjectId(orderId) },
            {
              $set: {
                status: newStatus,
                updatedAt: new Date()
              }
            },
            { session }
          )
        return result
      })
    } finally {
      await session.endSession()
    }

    return await GET_DB().collection(ORDER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(orderId) })
  } catch (error) {
    throw new Error(error)
  }
}

// Tìm đơn hàng mới nhất của user
const findLatestOrderByUserId = async (userId) => {
  try {
    return await GET_DB().collection(ORDER_COLLECTION_NAME)
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo, mới nhất lên đầu
      .limit(1) // Chỉ lấy 1 đơn hàng đầu tiên
      .toArray()
      .then(orders => orders[0] || null) // Trả về đơn hàng đầu tiên hoặc null nếu không có
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    return await GET_DB().collection(ORDER_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })// Trả về đơn hàng đầu tiên hoặc null nếu không có
  } catch (error) {
    throw new Error(error)
  }
}

// Lấy tất cả đơn hàng
const getAllOrders = async () => {
  try {
    return await GET_DB().collection(ORDER_COLLECTION_NAME)
      .find({})
      .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo, mới nhất lên đầu
      .toArray()
  } catch (error) {
    throw new Error(error)
  }
}

export const orderModel = {
  createNewOrder,
  findOrderById,
  findOrdersByUserId,
  findOrdersByStatus,
  // findOrdersByDateRange,
  findUserOrdersByStatus,
  updateOrderStatus,
  findLatestOrderByUserId,
  findOneById,
  getAllOrders
}