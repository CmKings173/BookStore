import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

export const fetchBooksDetailAPI = async (bookId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/books/${bookId}`)
  return response.data
}

export const fetchRelatedBooksAPI = async (categoryId, currentBookId, limit = 4) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/books/related?categoryId=${categoryId}&currentBookId=${currentBookId}&limit=${limit}`)
  return response.data
}

export const fetchCartsAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/carts`)
  return response.data
}

export const createNewOrderAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/orders/createOrder`,data)
  return response.data
}

export const fetchNewOrderAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/orders/getNewOrder`)
  return response.data
}

export const fetchOrdersAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/orders`)
  return response.data
}



