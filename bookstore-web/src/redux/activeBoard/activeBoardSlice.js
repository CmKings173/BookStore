import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'
import { mapOrder } from '~/utils/sorts'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty, cloneDeep } from 'lodash'
// Khởi tạo giá trị state của 1 slide trong redux
const initialState = {
  currentActiveBoard: null
}
// Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào redux , dùng middleware createAsyncThunk đi kèm với extraReducers
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
    // Axios sẽ trả kết quả về qua property của nó là data
    return response.data
  }
)
// Khởi tạo một cái slide trong kho lưu trữ redux-store
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // Reducers: Nơi xử lí dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây chúng ta gán nó ra một biến có ý nghĩa hơn
      const board = action.payload

      // Update lại dữ liệu của currentActiveBoard
      state.currentActiveBoard = board
    }
  },
  // Extra Reducer: Nơi xử lí dữ liệu bất đồng bộ (gọi api) và cập nhật dữ liệu vào redux
  // Thường dùng với createAsyncThunk để gọi api và cập nhật dữ liệu vào redux
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      // action.payload là dữ liệu trả về từ api (response.data)
      // b1: lấy dữ liệu từ action.payload
      let board = action.payload

      // b2: Xử lí dữ liệu cần thiết
      // Sắp xếp lại thứ tự column trước khi đẩy data xuống dưới component con (BoardContent)
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      // Xử lí vấn đề kéo thả trong 1 column rỗng
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          // Sắp xếp lại thứ tự card trước khi đẩy data xuống dưới component con
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      // b3: Update lại dữ liệu của currentActiveBoard
      state.currentActiveBoard = board
    })
  }
})

// Action: là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
export const { updateCurrentActiveBoard } = activeBoardSlice.actions

// Selector: là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}


// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer