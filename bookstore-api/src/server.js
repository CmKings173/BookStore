/* eslint-disable no-console */


import express from 'express'
import cors from 'cors'
import { corsOptions } from '~/config/cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import cookieParser from 'cookie-parser'

const START_SERVER =() => {
  const app = express()

  // Fix Cache from disk from ExpressJS
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  // Use Cookie
  app.use(cookieParser())

  // Xử lí CORS
  app.use(cors(corsOptions))

  // Enable req.body json data
  app.use(express.json())

  // Use APIs v1
  app.use('/v1', APIs_V1)

  // Middleware xử lí lỗi tập chung
  app.use(errorHandlingMiddleware)

  // Môi trường Production
  if (env.BUILD_MODE === 'production') {
    app.listen( process.env.PORT, () => {
      console.log(`Production: Hello ${env.AUTHOR}, Back-end Server is running successfully at port: ${ process.env.PORT }`)
    })
  } else {
    // Môi trường Local Dev
    app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      console.log(`Local: Hello ${env.AUTHOR}, Back-end Server is running successfully at http://${ env.LOCAL_DEV_APP_HOST }:${ env.LOCAL_DEV_APP_PORT }/`)
    })
  }

  // Thực hiện các tác vụ cleanup trước khi dừng server
  exitHook(() => {
    console.log(' Server is shutting down...')
    CLOSE_DB()
    console.log(' Disconnected from MongoDB Cloud Atlas')

  })
}

// Chỉ khi kết nối thành công với database thì mới start server
//Immediately Invoked Function Expressions (IIFE)
(async () => {
  try {
    console.log('Connecting to mongodb cloud')
    await CONNECT_DB()
    console.log('Connected to mongodb cloud')
    // Khởi động server BackEnd sau khi đã connect database
    START_SERVER()
  }
  catch (error) {
    console.error(error)
    process.exit(0)
  }
})()

// CONNECT_DB()
//   .then(() => console.log('Connected to mongodb cloud'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.error(error)
//     process.exit(0)
//   })
