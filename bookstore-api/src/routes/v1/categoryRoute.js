import express from 'express'
import { categoryValidation } from '~/validations/categoryValidation'
import { categoryController } from '~/controllers/categoryController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/create')
  .post(
    authMiddleware.isAuthorized,
    authMiddleware.checkRole('admin'),
    categoryValidation.createNew,
    categoryController.createNew
  )

Router.route('/')
  .get(categoryController.getCategories)

export const categoryRoute= Router