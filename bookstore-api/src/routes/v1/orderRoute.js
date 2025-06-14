import express from 'express'
import { orderValidation } from '~/validations/orderValidation'
import { orderController } from '~/controllers/orderController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/createOrder')
  .post(authMiddleware.isAuthorized, authMiddleware.checkRole('client', 'admin'), orderValidation.createNewOrder, orderController.createNewOrder)

Router.route('/getNewOrder')
  .get(authMiddleware.isAuthorized, authMiddleware.checkRole('client', 'admin'), orderController.findLatestOrderByUserId)

Router.route('/')
  .get(authMiddleware.isAuthorized, authMiddleware.checkRole('client', 'admin'), orderController.getOrders)

Router.route('/orderDetail/:id')
  .get(authMiddleware.isAuthorized, authMiddleware.checkRole('client', 'admin'), orderController.getOrderDetail)

Router.route('/getAllOrders')
  .get(authMiddleware.isAuthorized, authMiddleware.checkRole('admin'), orderController.getAllOrders)

Router.route('/updateOrderStatus/:id')
  .put(authMiddleware.isAuthorized, authMiddleware.checkRole('client', 'admin'), orderValidation.updateOrderStatus, orderController.updateOrderStatus)


export const orderRoute = Router

