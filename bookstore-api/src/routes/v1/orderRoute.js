import express from 'express'
import { cardValidation } from '~/validations/cardValidation'
import { cardController } from '~/controllers/cardController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .post(authMiddleware.isAuthorized, authMiddleware.checkRole('client', 'admin'), cardValidation.createNew, cardController.createNew)

export const cardRoute= Router