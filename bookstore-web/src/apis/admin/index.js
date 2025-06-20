import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'
import { toast } from 'react-toastify'

export const createNewBookAPI = async (bookData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/books`, bookData)
  toast.success("Thêm sách thành công")
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

export const fetchUsersAPI = async (searchPath) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users${searchPath}`)
  return response.data
}

export const deleteUserAPI = async (userId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/delete/${userId}`)
  toast.success("xoá tài khoản thành công")
  return response.data
}

export const getAllOrdersAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/orders/getAllOrders`)
  return response.data
}

export const updateUserAPI = async (userId, data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/updateRole/${userId}`, data)
  return response.data
}

// Category APIs
export const getAllCategoriesAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/categories`)
  return response.data
}

export const createCategoryAPI = async (categoryData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/categories/create`, categoryData)
  toast.success("Tạo danh mục thành công")
  return response.data
}

export const deleteCategoryAPI = async (categoryId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/categories/${categoryId}`)
  toast.success("Xóa danh mục thành công")
  return response.data
}

