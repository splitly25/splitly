/* eslint-disable no-console */
import exitHook from 'async-exit-hook' 
import express from 'express'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment.js'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'

const START_SERVER = () => {
  const app = express()
  const hostname = env.APP_HOST || 'localhost'
  const PORT = env.APP_PORT || 3000

  // Middleware to parse JSON request bodies, enable request json body data
  app.use(express.json())
  app.use('/v1', APIs_V1)

  // Middleware for handling errors globally
  app.use(errorHandlingMiddleware)


  app.listen(PORT, hostname, () => {
    console.log(`3.Server is running on http://${hostname}:${PORT}`)
  })

  // Cleanup tasks before exit application
  exitHook(() => {
    console.log('\n4.Exiting application, closing MongoDB connection...')
    CLOSE_DB()
    console.log('5.MongoDB connection closed.')
  })
}

(async () => {
  try {
    console.log('1.Connecting to MongoDB...')
    await CONNECT_DB()
    console.log('2.Connected to MongoDB successfully!')
    START_SERVER()
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    process.exit(0)
  }
})()

