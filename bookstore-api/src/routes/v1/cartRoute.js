import express from 'express'
import { cartController } from '~/controllers/cartController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { cartValidation } from '~/validations/cartValidation'
const Router = express.Router()

Router.route('/')
  .get(
    authMiddleware.isAuthorized,
    authMiddleware.checkRole('client', 'admin'),
    cartController.getCartByUserId)
  .post(
    authMiddleware.isAuthorized,
    authMiddleware.checkRole('client', 'admin'),
    cartController.addToCart
  )
  .delete(
    authMiddleware.isAuthorized,
    authMiddleware.checkRole('client', 'admin'),
    cartValidation.removeFromCart,
    cartController.removeFromCart
  )

Router.route('/total')
  .get(
    authMiddleware.isAuthorized,
    authMiddleware.checkRole('client', 'admin'),
    cartController.getTotalItems)

export const cartRoute = Router