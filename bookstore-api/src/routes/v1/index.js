import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from './boardRoute'
import { columnRoute } from '~/routes/v1/columnRoute'
import { cardRoute } from '~/routes/v1/cardRoute'
import { userRoute } from '~/routes/v1/userRoute'

const Router = express.Router()

// Check APIs V1/status
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs v1 are ready to use' })
})

// Board APIs
Router.use('/boards', boardRoute)

// Columns APIs
Router.use('/columns', columnRoute)

// Cards APIs
Router.use('/cards', cardRoute)

// user APIs
Router.use('/users', userRoute)

export const APIs_V1 = Router