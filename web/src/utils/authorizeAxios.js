import axios from 'axios'
import { toast } from 'react-toastify'

let authorizedAxiosInstance = axios.create()
authorizedAxiosInstance.defaults.timeout = 10 * 60 * 1000
authorizedAxiosInstance.defaults.withCredentials = true


authorizedAxiosInstance.interceptors.request.use( (config) => {
  return config
}, (error) => {
  return Promise.reject(error)
},
{ synchronous: true, runWhen: () => true }
)

authorizedAxiosInstance.interceptors.response.use((response) => {
  return response
}, (error) => {
  let errorMessage = error?.message

  if (error.response?.data?.message) {
    errorMessage = error.response.data.message
  }

  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }

  return Promise.reject(error)
})


export default authorizedAxiosInstance