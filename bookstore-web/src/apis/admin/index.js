import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

export const createNewBook = async () => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/books`)
  return response.data
}
