export const options = [
  { value: 'equal', label: 'Chia đều' },
  { value: 'by-person', label: 'Theo người' },
  { value: 'by-item', label: 'Theo món' },
]

/* eslint-disable no-undef */
let apiRoot = ''

// Check if we're in development or production
const isDevelopment = import.meta.env.DEV || process.env.BUILD_MODE === 'dev'
const isProduction = import.meta.env.PROD || process.env.BUILD_MODE === 'production'

if (isDevelopment) {
  apiRoot = 'http://localhost:8017'
} else if (isProduction) {
  apiRoot = 'https://splitly.be.khangdev.me'
} else {
  // Fallback to production API
  apiRoot = 'https://splitly.be.khangdev.me'
}
export const FIELD_REQUIRED_MESSAGE = 'This field is required.'

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12

export const API_ROOT = apiRoot
