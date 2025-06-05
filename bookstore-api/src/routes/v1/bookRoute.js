import express from 'express'
import { bookValidation } from '~/validations/bookValidation'
import { bookController } from '~/controllers/bookController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .get(bookController.getAllBooks)
  .post( bookValidation.createNew, bookController.createNew)

Router.route('/:id')
  .get( bookController.getDetails)
  .put(bookValidation.updateBook, bookController.updateBook )
  .delete(bookValidation.deleteBook, bookController.deleteBook)

export const bookRoute = Router