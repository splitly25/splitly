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

export const fetchHistorySearchingAPI = async(userId, numPage, limit, search, settled) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/history/search/${userId}?page=${numPage}&limit=${limit}&search=${search}&settled=${settled}`)
  return response.data

}

export const fetchHistoryFilterAPI = async(userId, numPage, limit, fromDate, toDate, payer) => {
  const params = new URLSearchParams({
    page: numPage,
    limit: limit
  })
  
  if (fromDate) params.append('fromDate', fromDate)
  if (toDate) params.append('toDate', toDate)
  if (payer) params.append('payer', payer)
  
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/history/filter/${userId}?${params.toString()}`)
  return response.data
}

export const fetchDebtsOwedToMeAPI = async(userId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/debts/${userId}/owed-to-me`)
  return response.data
}

export const fetchDebtsIOweAPI = async(userId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/debts/${userId}/i-owe`)
  return response.data
}

export const fetchDebtSummaryAPI = async(userId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/debts/${userId}/summary`)
  return response.data
}

