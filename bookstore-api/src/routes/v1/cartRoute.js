import express from 'express'
// import { bookValidation } from '~/validations/bookValidation'
import { cartController } from '~/controllers/bookController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .get(
    authMiddleware.isAuthorized,
    authMiddleware.checkRole('client', 'admin'),
    cartController.getCart)
  // .post(bookValidation.createNew, bookController.createNew)
