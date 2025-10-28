// This file loads environment variables from a .env file and exports them for use in the application.
// Everytime need to use env variables, just import { env } from '~/config/environment.js'
import 'dotenv/config'

export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  APP_HOST: process.env.APP_HOST,
  APP_PORT: process.env.APP_PORT,
  MONGODB_USER: process.env.MONGODB_USER,
  MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,
  AUTHOR: process.env.AUTHOR,
  BUILD_MODE: process.env.BUILD_MODE
}
