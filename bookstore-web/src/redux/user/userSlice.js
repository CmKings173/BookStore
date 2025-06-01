import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'
import { toast } from 'react-toastify'
// Khởi tạo giá trị state của 1 slide trong redux
const initialState = {
  currentUser: null
}
// Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào redux, dùng middleware createAsyncThunk đi kèm với extraReducers
export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
    // Axios sẽ trả kết quả về qua property của nó là data
    return response.data
  }
)

export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async (showSuccessMessage = true) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
    if (showSuccessMessage) {
      toast.success('Logged out successfully!')
    }
    return response.data
  }
)

export const updateUserAPI = createAsyncThunk(
  'user/updateUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/update`, data)
    return response.data
  }
)

// Khởi tạo một cái slide trong kho lưu trữ redux-store
export const userSlice = createSlice({
  name: 'user',
  initialState,

  // Reducers: Nơi xử lí dữ liệu đồng bộ
  reducers: {},

  // Extra Reducer: Nơi xử lí dữ liệu bất đồng bộ (gọi api) và cập nhật dữ liệu vào redux
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      // action.payload là dữ liệu trả về từ api (response.data)
      const user = action.payload
      state.currentUser = user
      // state.currentUser = action.payload

    }),

    builder.addCase(logoutUserAPI.fulfilled, (state, action) => {
      // API logout sau khi gọi thành công thì sẽ clear thông tin currentUser về null ở đây
      // Kết hợp protectedRoute đã làm ở App.js => code sẽ điều hướng về trang login
      state.currentUser = null
    }),

    builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      // API update user sau khi gọi thành công thì sẽ cập nhật thông tin currentUser ở đây
      const user = action.payload
      state.currentUser = user
    })
  }

})

// Action: là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// export const {} = userSlice.actions

// Selector: là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const userReducer = userSlice.reducer