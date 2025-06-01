
// Capitalize the first letter of a string
export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}
// Tạo card giữ chỗ
export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder_card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}

// Kỹ thuật dùng css pointer-event để chặn user spam click tại bất kỳ chỗ nào có hành động click gọi api
// Đây kà 1 kỹ thuật rất hay tận dụng Axios Interceptors và CSS pointer-events để chi phải viết code xử lý một lần cho toàn bộ dự án
// Cách sử dụng: Với tẩt cả các link hoặc button mà có hành động gọi api thì thêm class "interceptor-loading" cho nó là xong
export const interceptorLoadingElements = (calling) => {
  // DOM lấy ra toàn bộ phần tử trên page hiên tại có className là 'interceptor-loading'
  const element = document.querySelectorAll('.interceptor-loading')

  for (let i = 0; i < element.length; i++) {
    if (calling) {
      // Nếu đang trong thời gian chờ gọi API (calling === true) thì sẽ làm mờ phần tử và chặn click bằng css pointer-events
      element[i].style.opacity ='0.5'
      element[i].style.pointerEvents ='none'
    } else {
      // Ngược lại thì trả về như ban đầu, không làm gì cả
      element[i].style.opacity ='initial'
      element[i].style.pointerEvents ='initial'
    }
  }
}
