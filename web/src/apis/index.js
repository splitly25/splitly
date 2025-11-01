import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

export const fetchABCDetailsAPI= async(id) => {
  const response= await authorizedAxiosInstance.get(`${API_ROOT}/v1/abc/${id}`)
  return response.data
}