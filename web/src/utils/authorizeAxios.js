import axios from 'axios'
import { toast } from 'react-toastify'
import { logoutUserAPI } from '~/redux/user/userSlice'
import { interceptorLoadingElements } from '~/utils/formatters'

let axiosReduxStore
export const injectStore = (store) => {
  axiosReduxStore = store
}

let authorizedAxiosInstance = axios.create()
authorizedAxiosInstance.defaults.timeout = 10 * 60 * 1000
authorizedAxiosInstance.defaults.withCredentials = true

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

    if (error.response?.status === 401) {
      axiosReduxStore.dispatch(logoutUserAPI(false))
    }

    // Global error handling for all over the app
    let errorMessage = error?.message
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    }

    if (error.response?.status !== 410) {
      toast.error(errorMessage)
    }

    return Promise.reject(error)
  }
)

export default authorizedAxiosInstance
