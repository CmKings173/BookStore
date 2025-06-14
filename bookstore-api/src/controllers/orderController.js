import { StatusCodes } from 'http-status-codes'
import { orderService } from '~/services/orderService'

const createNewOrder = async (req, res, next) => {
  try {
    // Điều hướng dữ liệu sang tầng Service
    const userId = req.jwtDecoded._id
    const createdOrder = await orderService.createNewOrder(userId, req.body)
    // Có kết quả thì trả về phía client
    res.status(StatusCodes.CREATED).json(createdOrder)
  }
  catch (error) {
    next(error)
  }
}

const findLatestOrderByUserId = async (req, res, next) => {
  try {

    const Order = await orderService.findLatestOrderByUserId(req.jwtDecoded._id)
    res.status(StatusCodes.OK).json(Order)
  }
  catch (error) {
    next(error)
  }
}

const getOrders = async (req, res, next) => {
  try {

    const Orders = await orderService.getOrders(req.jwtDecoded._id)
    res.status(StatusCodes.OK).json(Orders)
  }
  catch (error) {
    next(error)
  }
}

const getOrderDetail = async (req, res, next) => {
  try {
    const order = await orderService.getOrderDetail(req.params.id)
    res.status(StatusCodes.OK).json(order)
  }
  catch (error) {
    next(error)
  }
}

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders()
    res.status(StatusCodes.OK).json(orders)
  }
  catch (error) {
    next(error)
  }
}

const updateOrderStatus = async (req, res, next) => {
  try {
    const orderId = req.params.id
    const { status } = req.body
    const result = await orderService.updateOrderStatus(orderId, status)
    res.status(StatusCodes.OK).json(result)
  }
  catch (error) {
    next(error)
  }
}

export const orderController = {
  createNewOrder,
  findLatestOrderByUserId,
  getOrders,
  getOrderDetail,
  getAllOrders,
  updateOrderStatus
}