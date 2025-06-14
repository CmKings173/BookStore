import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'
import { toast } from 'react-toastify'

export const fetchBooksAPI = async (searchPath) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/books${searchPath}`)
  return response.data
}

export const fetchCategoriesAPI = async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/categories`)
    return response.data
}

// User
export const registerUserApi = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/register`, data)
  toast.success('Account created successfully! Please check and verify your account before logging in!', { theme: 'colored' } )
  return response.data
}

export const verifyUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/verify`, data)
  toast.success('Account verified successfully! Now you can login to enjoy our success! Have a good day', { theme: 'colored' } )
  return response.data
}

export const refreshTokenAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/refresh_token`)
  return response.data
}

// Tìm kiếm sách
export const searchBooksAPI = async (query) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/books/search${query}`)
  return response.data
}

export const fetchOrderDetailAPI = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/orders/orderDetail/${id}`)
  return response.data
}

export const updateOrderStatusAPI = async (orderId, status) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/orders/updateOrderStatus/${orderId}`, { status })
  return response.data
}
