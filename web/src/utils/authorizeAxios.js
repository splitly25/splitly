import axios from 'axios'
import { toast } from 'react-toastify'
import { clearUser } from '~/redux/user/userSlice'
import { interceptorLoadingElements } from '~/utils/formatters'
import { API_ROOT } from '~/utils/constants'

let axiosReduxStore
export const injectStore = (store) => {
  axiosReduxStore = store
}

let authorizedAxiosInstance = axios.create({
  baseURL: API_ROOT
})
authorizedAxiosInstance.defaults.timeout = 10 * 60 * 1000
authorizedAxiosInstance.defaults.withCredentials = true

let isLoggingout = false

// Add a request interceptor
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    // block spam clicks or actions during loading state
    interceptorLoadingElements(true)

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
  { synchronous: true, runWhen: () => true }
)

authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    interceptorLoadingElements(false)
    return response
  },
  (error) => {
    interceptorLoadingElements(false)

    if (error.response?.status === 401 && !isLoggingout) {
      isLoggingout = true
      
      // Clear user state locally without calling logout API
      axiosReduxStore.dispatch(clearUser())
      
      // Navigate to login page
      window.location.href = '/login'
      
      isLoggingout = false
    }

    // Global error handling for all over the app
    let errorMessage = error?.message
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    }

    // Don't show toast for 401 errors since we're redirecting
    if (error.response?.status !== 410 && error.response?.status !== 401) {
      toast.error(errorMessage)
    }

    return Promise.reject(error)
  }
)

export default authorizedAxiosInstance
