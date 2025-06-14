import express from 'express'
import { bookValidation } from '~/validations/bookValidation'
import { bookController } from '~/controllers/bookController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .get(bookController.getAllBooks)
  .post(
    // authMiddleware.isAuthorized,
    // authMiddleware.checkRole('admin'),
    bookValidation.createNew,
    bookController.createNew
  )

Router.route('/search')
  .get(bookController.searchBooks)

Router.route('/related')
  .get(bookController.getRelatedBooks)

Router.route('/:id')
  .get(bookController.getDetails)
  .put(
    authMiddleware.isAuthorized,
    authMiddleware.checkRole('admin'),
    bookValidation.updateBook,
    bookController.updateBook)
  .delete(
    authMiddleware.isAuthorized,
    authMiddleware.checkRole('admin'),
    bookValidation.deleteBook,
    bookController.deleteBook)

export const bookRoute = Router