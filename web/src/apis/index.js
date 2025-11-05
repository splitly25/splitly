import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

export const fetchABCDetailsAPI= async(id) => {
  const response= await authorizedAxiosInstance.get(`${API_ROOT}/v1/abc/${id}`)
  return response.data
}

export const fetchDashboardDataAPI = async(userId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/dashboard/${userId}`)
  return response.data
}

export const fetchHistoryDataAPI = async(userId, numPage, limit, search, settled) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/history/${userId}?page=${numPage}&limit=${limit}&search=${search}&settled=${settled}`)
  return response.data
}