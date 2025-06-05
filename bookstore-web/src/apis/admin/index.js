import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

export const createNewBookAPI = async (bookData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/books`, bookData)
  return response.data
}
export const updateBookAPI = async (bookId, data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/books/${bookId}`, data)
  return response.data
}

export const deleteBookAPI = async (bookId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/books/${bookId}`)
  return response.data
}

