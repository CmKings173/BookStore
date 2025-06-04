import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

export const fetchBooksDetailAPI = async (bookId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/books/${bookId}`)
  return response.data
}
