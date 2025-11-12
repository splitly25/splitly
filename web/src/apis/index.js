import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { toast } from 'react-toastify'

export const fetchDashboardDataAPI = async (userId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/dashboard/${userId}`)
  return response.data
}

export const fetchHistoryDataAPI = async (userId, numPage, limit, search, settled) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/history/${userId}?page=${numPage}&limit=${limit}&search=${search}&settled=${settled}`
  )
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

export const fetchDebtsOwedToMeAPI = async (userId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/debts/${userId}/owed-to-me`)
  return response.data
}

export const fetchDebtsIOweAPI = async (userId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/debts/${userId}/i-owe`)
  return response.data
}

export const fetchDebtSummaryAPI = async (userId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/debts/${userId}/summary`)
  return response.data
}

export const submitPaymentRequestAPI = async (userId, paymentData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/debts/${userId}/payment`, paymentData)
  toast.success('Yêu cầu thanh toán đã được gửi thành công!', { theme: 'colored' })
  return response.data
}

// ============================================
// USERS APIs
// ============================================
export const registerUserAPI = async (userData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/register`, userData)
  toast.success('Registration successful! Please check your email to verify your account.', { theme: 'colored' })
  return response.data
}

export const verifyUserAccountAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/verify_account`, data)
  toast.success('Account verified successfully! Now you can log in.', { theme: 'colored' })
  return response.data
}

export const getUserByEmailAPI = async (email) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/email/${email}`)
  return response.data
}

export const getUserByIdAPI = async (userId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/${userId}`)
  return response.data
}

// ============================================
// BILL APIs
// ============================================

// Create a new bill
export const createBillAPI = async (billData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/bills`, billData)
  toast.success('Hóa đơn đã được tạo thành công!', { theme: 'colored' })
  return response.data
}

// Get all bills for a user
export const fetchUserBillsAPI = async (userId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/bills/user/${userId}`)
  return response.data
}

// ============================================
// GROUP APIs
// ============================================

export const getAllGroupsAndMembersAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/groups/getAllGroupAndMembers`)
  return response.data
}

export const getGroupsByUserIdAPI = async (userId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/groups/user/${userId}`)
  return response.data
}

export const getGroupByIdAPI = async (groupId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/groups/${groupId}`)
  return response.data
}


// OCR Bill
export const sendOcrBillAPI = async(imageData, userId) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/bills/scan`, {
    userId: userId, 
    imageData: imageData
  })
  return response.data
}
