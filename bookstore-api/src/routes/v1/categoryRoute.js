import express from 'express'
import { categoryValidation } from '~/validations/categoryValidation'
import { categoryController } from '~/controllers/categoryController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/create')
  .post(categoryValidation.createNew, categoryController.createNew)

Router.route('/')
  .get(categoryController.getCategories)

// Router.route('/:id')
//   .put(authMiddleware.isAuthorized, columnValidation.update, columnController.update )
//   .delete(authMiddleware.isAuthorized, columnValidation.deleteItem, columnController.deleteItem)

export const categoryRoute= Router