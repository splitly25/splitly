export const options = [
  { value: 'equal', label: 'Chia đều' },
  { value: 'by-person', label: 'Theo người' },
  { value: 'by-item', label: 'Theo món' },
]

/* eslint-disable no-undef */
let apiRoot = ''

if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
} else if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://splitly.be.khangdev.me'
}
export const FIELD_REQUIRED_MESSAGE = 'This field is required.'

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12

export const API_ROOT = apiRoot
