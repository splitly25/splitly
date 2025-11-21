/* eslint-disable no-console */
import exitHook from 'async-exit-hook'
import express from 'express'
import cors from 'cors'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment.js'
import { corsOptions } from '~/config/cors.js'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import { initializeDatabase } from '~/config/initDB'
import cookieParser from 'cookie-parser'
import { NodemailerProvider } from '~/providers/NodemailerProvider'

const START_SERVER = () => {
  const app = express()
  const hostname = env.APP_HOST || 'localhost'
  const PORT = env.APP_PORT || 3000

  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })
  app.use(cookieParser())
  // Middleware to enable CORS with proper configuration
  app.use(cors(corsOptions))
  app.use(express.json({ limit: '20mb' }))
  app.use('/v1', APIs_V1)
  app.use(errorHandlingMiddleware)

  app.listen(PORT, hostname, () => {
    console.log(`7.Server is running on http://${hostname}:${PORT}`)
  })

  exitHook(() => {
    console.log('\n8.Exiting application, closing MongoDB connection...')
    CLOSE_DB()
    console.log('9.MongoDB connection closed.')
  })
}

;(async () => {
  try {
    console.log('1.Connecting to MongoDB...')
    await CONNECT_DB()
    console.log('2.Connected to MongoDB successfully!')

    console.log('3.Initializing database indexes...')
    await initializeDatabase()
    console.log('4.Database indexes initialized!')

    console.log('5.Verifying SMTP connection...')
    const smtpReady = await NodemailerProvider.verifyConnection()
    if (!smtpReady) {
      console.warn('⚠️  WARNING: SMTP is not configured correctly. Emails will fail to send!')
      console.warn('   Please check your SMTP environment variables (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD)')
    } else {
      console.log('6.SMTP connection verified successfully!')
    }

    START_SERVER()
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    process.exit(0)
  }
})()
