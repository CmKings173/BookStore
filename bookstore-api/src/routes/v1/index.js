import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { bookRoute } from '~/routes/v1/bookRoute'
import { categoryRoute } from '~/routes/v1/categoryRoute'

// import { columnRoute } from '~/routes/v1/columnRoute'
// import { orderRoute } from '~/routes/v1/orderRoute'
import { userRoute } from '~/routes/v1/userRoute'

const Router = express.Router()

// Check APIs V1/status
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs v1 are ready to use' })
})

// Board APIs
Router.use('/books', bookRoute)

// Categories APIs
Router.use('/categories', categoryRoute)

// Cards APIs
// Router.use('/orders', orderRoute)

// user APIs
Router.use('/users', userRoute)

export const APIs_V1 = Router