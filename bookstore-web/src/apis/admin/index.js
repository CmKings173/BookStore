import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'
import { toast } from 'react-toastify'

export const createNewBookAPI = async (bookData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/books`, bookData)
  if(response){
    toast.success("Thêm sách thành công")
  }
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
  return response.data
}
