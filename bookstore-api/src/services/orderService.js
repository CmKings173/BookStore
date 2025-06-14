import { orderModel } from '~/models/orderModel'
import { bookModel } from '~/models/bookModel'

import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createNewOrder = async (userId, reqBody) => {
  try {
    const newOrder = {
      userId: userId,
      ...reqBody
    }
    const createdOrder = await orderModel.createNewOrder(newOrder)
    return createdOrder
  } catch (error) { throw new Error(error)}
}

const findLatestOrderByUserId = async (userId) => {
  try {
    const order = await orderModel.findLatestOrderByUserId(userId)
    if (!order) return null

    // Lấy thông tin sách cho mỗi item trong đơn hàng
    const itemsWithBookInfo = await Promise.all(
      order.items.map(async (item) => {
        const book = await bookModel.findOneById(item.bookId)
        return {
          ...item,
          title: book.title,
          image:book.image,
          price: book.price
        }
      })
    )

    // Cập nhật lại items trong đơn hàng với thông tin sách
    return {
      ...order,
      items: itemsWithBookInfo
    }
  } catch (error) {
    throw new Error(error)
  }
}

const getOrders = async (userId) => {
  try {
    const orders = await orderModel.findOrdersByUserId(userId)
    if (!orders) return []

    // Lấy thông tin sách cho mỗi item trong mỗi đơn hàng
    const ordersWithBookInfo = await Promise.all(
      orders.map(async (order) => {
        const itemsWithBookInfo = await Promise.all(
          order.items.map(async (item) => {
            const book = await bookModel.findOneById(item.bookId)
            return {
              ...item,
              title: book.title,
              image: book.image,
              price: book.price
            }
          })
        )

        return {
          ...order,
          items: itemsWithBookInfo
        }
      })
    )

    return ordersWithBookInfo
  } catch (error) {
    throw new Error(error)
  }
}

const getOrderDetail = async (id) => {
  try {
    const order = await orderModel.findOneById(id)
    if (!order) return null

    // Lấy thông tin sách cho mỗi item trong đơn hàng
    const itemsWithBookInfo = await Promise.all(
      order.items.map(async (item) => {
        const book = await bookModel.findOneById(item.bookId)
        return {
          ...item,
          title: book.title,
          image:book.image,
          price: book.price
        }
      })
    )

    // Cập nhật lại items trong đơn hàng với thông tin sách
    return {
      ...order,
      items: itemsWithBookInfo
    }
  } catch (error) {
    throw new Error(error)
  }
}

const getAllOrders = async () => {
  try {
    const orders = await orderModel.getAllOrders()
    if (!orders) return []
    return orders
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Lỗi khi lấy danh sách đơn hàng')
  }
}

const updateOrderStatus = async (orderId, status) => {
  try {
    const result = await orderModel.updateOrderStatus(orderId, status)
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'không thể sang trạng thái này')
  }
}

export const orderService = {
  createNewOrder,
  findLatestOrderByUserId,
  getOrders,
  getOrderDetail,
  getAllOrders,
  updateOrderStatus
}