/* eslint-disable no-console */
import exitHook from 'async-exit-hook' 
import express from 'express'
import cors from 'cors'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment.js'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import { initializeDatabase } from '~/config/initDB'

const START_SERVER = () => {
  const app = express()
  const hostname = env.APP_HOST || 'localhost'
  const PORT = env.APP_PORT || 3000

  // Middleware to enable CORS
  // TODO: Configure CORS options as needed
  app.use(cors())
  app.use(express.json())
  app.use('/v1', APIs_V1)
  app.use(errorHandlingMiddleware)


  app.listen(PORT, hostname, () => {
    console.log(`5.Server is running on http://${hostname}:${PORT}`)
  })

  exitHook(() => {
    console.log('\n6.Exiting application, closing MongoDB connection...')
    CLOSE_DB()
    console.log('7.MongoDB connection closed.')
  })
}

(async () => {
  try {
    console.log('1.Connecting to MongoDB...')
    await CONNECT_DB()
    console.log('2.Connected to MongoDB successfully!')
    
    console.log('3.Initializing database indexes...')
    await initializeDatabase()
    console.log('4.Database indexes initialized!')
    
    START_SERVER()
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    process.exit(0)
  }
})()

