// import { WHITELIST_DOMAINS } from '~/utils/constants'
// import { env } from '~/config/environment'
// import { StatusCodes } from 'http-status-codes'
// import APIError from '~/utils/APIError'

// CORS Options Configuration
export const corsOptions = {
  // Allow all origins
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    // Allow all origins in development and production
    return callback(null, true)
  },
  
  // Allow all methods
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  
  // Allow all headers
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  
  optionsSuccessStatus: 200,

  // CORS will allow receiving cookies from requests
  credentials: true,
}
